<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Training Sets</h1>
      <p class="text-gray-600 mt-2">Create and manage your custom vocabulary sets</p>
    </div>

    <!-- Main content -->
    <div v-if="currentView === 'list'">
      <TrainingSetList
        @create-set="showCreateForm"
        @select-set="selectTrainingSet"
        @edit-set="editTrainingSet"
        @delete-set="showDeleteConfirmation"
      />
    </div>

    <div v-else-if="currentView === 'create'">
      <TrainingSetEditor
        @success="handleCreateSuccess"
        @cancel="currentView = 'list'"
      />
    </div>

    <div v-else-if="currentView === 'edit'">
      <TrainingSetEditor
        :training-set="selectedTrainingSet"
        @success="handleEditSuccess"
        @cancel="currentView = 'list'"
      />
    </div>

    <div v-else-if="currentView === 'detail'">
      <TrainingSetDetail
        :training-set="selectedTrainingSet"
        @edit="editTrainingSet"
        @delete="showDeleteConfirmation"
        @back="currentView = 'list'"
      />
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Training Set</h3>
        </div>
        
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ trainingSetToDelete?.name }}"? This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            :disabled="deleteLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            <span v-if="deleteLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50"
    >
      <div class="flex">
        <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TrainingSetList from '../components/training-sets/TrainingSetList.vue'
import TrainingSetEditor from '../components/training-sets/TrainingSetEditor.vue'
import TrainingSetDetail from '../components/training-sets/TrainingSetDetail.vue'
import { TrainingSetApi } from '../services/trainingSetApi'
import type { TrainingSet } from '../types'

// Reactive state
const currentView = ref<'list' | 'create' | 'edit' | 'detail'>('list')
const selectedTrainingSet = ref<TrainingSet | null>(null)
const showDeleteModal = ref(false)
const trainingSetToDelete = ref<TrainingSet | null>(null)
const deleteLoading = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// Show create form
const showCreateForm = () => {
  selectedTrainingSet.value = null
  currentView.value = 'create'
}

// Select training set for viewing
const selectTrainingSet = (trainingSet: TrainingSet) => {
  selectedTrainingSet.value = trainingSet
  currentView.value = 'detail'
}

// Edit training set
const editTrainingSet = (trainingSet: TrainingSet) => {
  selectedTrainingSet.value = trainingSet
  currentView.value = 'edit'
}

// Show delete confirmation
const showDeleteConfirmation = (trainingSet: TrainingSet) => {
  trainingSetToDelete.value = trainingSet
  showDeleteModal.value = true
}

// Handle create success
const handleCreateSuccess = () => {
  currentView.value = 'list'
  showSuccess('Training set created successfully!')
}

// Handle edit success
const handleEditSuccess = () => {
  currentView.value = 'list'
  showSuccess('Training set updated successfully!')
}

// Confirm delete
const confirmDelete = async () => {
  if (!trainingSetToDelete.value) return

  try {
    deleteLoading.value = true
    const response = await TrainingSetApi.deleteTrainingSet(trainingSetToDelete.value.id)

    if (response.success) {
      showDeleteModal.value = false
      trainingSetToDelete.value = null
      currentView.value = 'list'
      showSuccess('Training set deleted successfully!')
    } else {
      // Handle error - you might want to show an error message
      console.error('Failed to delete training set:', response.error)
    }
  } catch (error) {
    console.error('Network error:', error)
  } finally {
    deleteLoading.value = false
  }
}

// Show success message
const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}
</script>
