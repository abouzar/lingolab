<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Training Set' : 'Create Training Set' }}
      </h2>
      <p class="text-gray-600 mt-1">
        {{ isEditing ? 'Update your training set details and words' : 'Create a new training set with German vocabulary' }}
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-300': errors.name }"
              placeholder="e.g., Basic German Vocabulary"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-300': errors.category }"
            >
              <option value="">Select a category</option>
              <option value="general">General</option>
              <option value="business">Business</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="family">Family</option>
              <option value="hobbies">Hobbies</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
          </div>
        </div>
        
        <div class="mt-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe what this training set covers..."
          ></textarea>
        </div>
        
        <div class="mt-4">
          <label class="flex items-center">
            <input
              v-model="form.isPublic"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Make this training set public</span>
          </label>
        </div>
      </div>

      <!-- Word Selection -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Words</h3>
          <button
            type="button"
            @click="showWordSelector = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Words
          </button>
        </div>

        <p v-if="errors.words" class="mb-4 text-sm text-red-600">{{ errors.words }}</p>

        <!-- Selected words list -->
        <div v-if="selectedWords.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p>No words selected yet</p>
          <p class="text-sm">Click "Add Words" to start building your training set</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(word, index) in selectedWords"
            :key="word.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @drop="handleDrop(index)"
          >
            <div class="flex items-center space-x-3">
              <div class="cursor-move text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ word.text }}</div>
                <div class="text-sm text-gray-600">
                  {{ word.translations?.[0]?.translation || 'No translation' }}
                  <span class="mx-2">•</span>
                  <span class="capitalize">{{ word.partOfSpeech }}</span>
                  <span class="mx-2">•</span>
                  <span>Difficulty: {{ word.difficulty }}/5</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              @click="removeWord(index)"
              class="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Remove word"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || selectedWords.length === 0"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>
            {{ isEditing ? 'Update Training Set' : 'Create Training Set' }}
          </span>
        </button>
      </div>
    </form>

    <!-- Word Selector Modal -->
    <WordSelector
      v-if="showWordSelector"
      :selected-word-ids="selectedWords.map(w => w.id)"
      @close="showWordSelector = false"
      @select-words="handleWordsSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { TrainingSetApi } from '../../services/trainingSetApi'
import WordSelector from './WordSelector.vue'
import type { TrainingSet, Word } from '../../types'

// Props and emits
const props = defineProps<{
  trainingSet?: TrainingSet
}>()

defineEmits<{
  'success': [trainingSet: TrainingSet]
  'cancel': []
}>()

// Computed
const isEditing = computed(() => !!props.trainingSet)

// Reactive state
const loading = ref(false)
const showWordSelector = ref(false)
const selectedWords = ref<Word[]>([])
const draggedIndex = ref<number | null>(null)

const form = reactive({
  name: '',
  description: '',
  category: '',
  isPublic: false
})

const errors = reactive({
  name: '',
  category: '',
  words: ''
})

// Initialize form
onMounted(() => {
  if (props.trainingSet) {
    form.name = props.trainingSet.name
    form.description = props.trainingSet.description || ''
    form.category = props.trainingSet.category
    form.isPublic = props.trainingSet.isPublic
    
    // Extract words from training set
    selectedWords.value = props.trainingSet.words?.map(tsw => tsw.word!).filter(Boolean) || []
  }
})

// Validation
const validateForm = () => {
  errors.name = ''
  errors.category = ''
  errors.words = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!form.category) {
    errors.category = 'Category is required'
  }

  if (selectedWords.value.length === 0) {
    errors.words = 'At least one word is required'
  }

  return !errors.name && !errors.category && !errors.words
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    const wordIds = selectedWords.value.map(word => word.id)
    const data = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      wordIds,
      isPublic: form.isPublic
    }

    let response
    if (isEditing.value) {
      response = await TrainingSetApi.updateTrainingSet(props.trainingSet!.id, data)
    } else {
      response = await TrainingSetApi.createTrainingSet(data)
    }

    if (response.success && response.data) {
      $emit('success', response.data)
    } else {
      // Handle API errors
      const errorMessage = response.error?.message || 'Failed to save training set'
      if (errorMessage.includes('already exists')) {
        errors.name = 'A training set with this name already exists'
      } else {
        errors.words = errorMessage
      }
    }
  } catch (error) {
    errors.words = 'Network error occurred'
  } finally {
    loading.value = false
  }
}

// Handle words selection from modal
const handleWordsSelected = (words: Word[]) => {
  selectedWords.value = words
  showWordSelector.value = false
}

// Remove word from selection
const removeWord = (index: number) => {
  selectedWords.value.splice(index, 1)
}

// Drag and drop handlers
const handleDragStart = (index: number) => {
  draggedIndex.value = index
}

const handleDrop = (dropIndex: number) => {
  if (draggedIndex.value === null) return

  const draggedWord = selectedWords.value[draggedIndex.value]
  selectedWords.value.splice(draggedIndex.value, 1)
  selectedWords.value.splice(dropIndex, 0, draggedWord)
  
  draggedIndex.value = null
}
</script>