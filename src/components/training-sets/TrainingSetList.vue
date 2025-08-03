<template>
  <div class="space-y-6">
    <!-- Header with search and filters -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search training sets..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debouncedSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2">
        <select
          v-model="selectedCategory"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @change="loadTrainingSets"
        >
          <option value="">All Categories</option>
          <option value="general">General</option>
          <option value="business">Business</option>
          <option value="travel">Travel</option>
          <option value="food">Food</option>
          <option value="family">Family</option>
          <option value="hobbies">Hobbies</option>
        </select>
        
        <button
          @click="$emit('create-set')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Set
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading training sets</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          <button
            @click="loadTrainingSets"
            class="mt-2 text-sm text-red-800 underline hover:text-red-900"
          >
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="trainingSets.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No training sets found</h3>
      <p class="text-gray-600 mb-4">
        {{ searchQuery ? 'No training sets match your search.' : 'Create your first training set to get started.' }}
      </p>
      <button
        v-if="!searchQuery"
        @click="$emit('create-set')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Create Training Set
      </button>
    </div>

    <!-- Training sets grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="trainingSet in trainingSets"
        :key="trainingSet.id"
        class="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
        @click="$emit('select-set', trainingSet)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900 truncate">{{ trainingSet.name }}</h3>
            <div class="flex gap-1 ml-2">
              <button
                @click.stop="$emit('edit-set', trainingSet)"
                class="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Edit training set"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click.stop="$emit('delete-set', trainingSet)"
                class="p-1 text-gray-400 hover:text-red-600 rounded"
                title="Delete training set"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <p v-if="trainingSet.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
            {{ trainingSet.description }}
          </p>
          
          <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span class="bg-gray-100 px-2 py-1 rounded-full">{{ trainingSet.category }}</span>
            <span>{{ trainingSet.words?.length || 0 }} words</span>
          </div>
          
          <div class="flex items-center justify-between text-xs text-gray-400">
            <span>Created {{ formatDate(trainingSet.createdAt) }}</span>
            <span v-if="trainingSet.isPublic" class="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Public
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load more button -->
    <div v-if="hasMore && !loading" class="text-center">
      <button
        @click="loadMore"
        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrainingSetApi } from '../../services/trainingSetApi'
import type { TrainingSet } from '../../types'

// Props and emits
defineEmits<{
  'create-set': []
  'select-set': [trainingSet: TrainingSet]
  'edit-set': [trainingSet: TrainingSet]
  'delete-set': [trainingSet: TrainingSet]
}>()

// Reactive state
const trainingSets = ref<TrainingSet[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const currentOffset = ref(0)
const hasMore = ref(true)
const limit = 12

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchTrainingSets()
    } else {
      loadTrainingSets()
    }
  }, 300)
}

// Load training sets
const loadTrainingSets = async (append = false) => {
  try {
    loading.value = true
    error.value = null
    
    const offset = append ? currentOffset.value : 0
    const response = await TrainingSetApi.getTrainingSets({
      limit,
      offset,
      category: selectedCategory.value || undefined
    })

    if (response.success && response.data) {
      if (append) {
        trainingSets.value.push(...response.data)
      } else {
        trainingSets.value = response.data
        currentOffset.value = 0
      }
      
      currentOffset.value = offset + response.data.length
      hasMore.value = response.data.length === limit
    } else {
      error.value = response.error?.message || 'Failed to load training sets'
    }
  } catch (err) {
    error.value = 'Network error occurred'
  } finally {
    loading.value = false
  }
}

// Search training sets
const searchTrainingSets = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await TrainingSetApi.searchTrainingSets(searchQuery.value.trim(), 50)

    if (response.success && response.data) {
      trainingSets.value = response.data
      hasMore.value = false // Search doesn't support pagination
    } else {
      error.value = response.error?.message || 'Failed to search training sets'
    }
  } catch (err) {
    error.value = 'Network error occurred'
  } finally {
    loading.value = false
  }
}

// Load more training sets
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    loadTrainingSets(true)
  }
}

// Format date helper
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

// Load training sets on mount
onMounted(() => {
  loadTrainingSets()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>