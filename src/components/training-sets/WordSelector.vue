<template>
  <!-- Modal backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Select Words</h3>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search and filters -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search German words..."
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
              v-model="selectedPartOfSpeech"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="loadWords"
            >
              <option value="">All Parts of Speech</option>
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
              <option value="conjunction">Conjunction</option>
              <option value="interjection">Interjection</option>
              <option value="article">Article</option>
              <option value="pronoun">Pronoun</option>
            </select>
            
            <select
              v-model="selectedDifficulty"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="loadWords"
            >
              <option value="">All Difficulties</option>
              <option value="1">Beginner (1)</option>
              <option value="2">Easy (2)</option>
              <option value="3">Medium (3)</option>
              <option value="4">Hard (4)</option>
              <option value="5">Expert (5)</option>
            </select>
          </div>
        </div>
        
        <!-- Selection summary -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            {{ selectedWordIds.length }} word{{ selectedWordIds.length !== 1 ? 's' : '' }} selected
          </div>
          <div class="flex gap-2">
            <button
              @click="selectAll"
              :disabled="words.length === 0"
              class="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              Select All
            </button>
            <button
              @click="clearSelection"
              :disabled="selectedWordIds.length === 0"
              class="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Words list -->
      <div class="flex-1 overflow-y-auto p-6">
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
              <h3 class="text-sm font-medium text-red-800">Error loading words</h3>
              <p class="mt-1 text-sm text-red-700">{{ error }}</p>
              <button
                @click="loadWords"
                class="mt-2 text-sm text-red-800 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="words.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No words found</h3>
          <p class="text-gray-600">
            {{ searchQuery ? 'No words match your search criteria.' : 'No words available.' }}
          </p>
        </div>

        <!-- Words grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="word in words"
            :key="word.id"
            class="border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors"
            :class="{
              'border-blue-500 bg-blue-50': selectedWordIds.includes(word.id),
              'hover:border-gray-300': !selectedWordIds.includes(word.id)
            }"
            @click="toggleWordSelection(word.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h4 class="font-semibold text-gray-900">{{ word.text }}</h4>
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                    {{ word.partOfSpeech }}
                  </span>
                  <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {{ word.difficulty }}/5
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-2">
                  {{ word.translations?.[0]?.translation || 'No translation available' }}
                </p>
                
                <!-- Word attributes -->
                <div v-if="word.attributes && word.attributes.length > 0" class="flex flex-wrap gap-1 mb-2">
                  <span
                    v-for="attr in word.attributes.slice(0, 3)"
                    :key="attr.id"
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {{ attr.attributeType }}: {{ attr.attributeValue }}
                  </span>
                </div>
                
                <!-- Example sentence -->
                <div v-if="word.examples && word.examples.length > 0" class="text-xs text-gray-500">
                  <p class="italic">"{{ word.examples[0].sentence }}"</p>
                  <p class="mt-1">"{{ word.examples[0].translation }}"</p>
                </div>
              </div>
              
              <div class="ml-3">
                <div
                  class="w-5 h-5 border-2 rounded flex items-center justify-center"
                  :class="{
                    'border-blue-500 bg-blue-500': selectedWordIds.includes(word.id),
                    'border-gray-300': !selectedWordIds.includes(word.id)
                  }"
                >
                  <svg
                    v-if="selectedWordIds.includes(word.id)"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200">
        <div class="text-sm text-gray-600">
          {{ selectedWordIds.length }} word{{ selectedWordIds.length !== 1 ? 's' : '' }} selected
        </div>
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            :disabled="selectedWordIds.length === 0"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Selected Words
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { WordApi } from '../../services/wordApi'
import type { Word } from '../../types'

// Props and emits
const props = defineProps<{
  selectedWordIds: string[]
}>()

defineEmits<{
  'close': []
  'select-words': [words: Word[]]
}>()

// Reactive state
const words = ref<Word[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedPartOfSpeech = ref('')
const selectedDifficulty = ref('')
const selectedWordIds = ref<string[]>([...props.selectedWordIds])

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchWords()
    } else {
      loadWords()
    }
  }, 300)
}

// Load words
const loadWords = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await WordApi.getWords({
      limit: 100,
      partOfSpeech: selectedPartOfSpeech.value || undefined,
      difficulty: selectedDifficulty.value ? parseInt(selectedDifficulty.value) : undefined
    })

    if (response.success && response.data) {
      words.value = response.data
    } else {
      error.value = response.error?.message || 'Failed to load words'
    }
  } catch (err) {
    error.value = 'Network error occurred'
  } finally {
    loading.value = false
  }
}

// Search words
const searchWords = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await WordApi.searchWords(searchQuery.value.trim(), 100)

    if (response.success && response.data) {
      words.value = response.data
    } else {
      error.value = response.error?.message || 'Failed to search words'
    }
  } catch (err) {
    error.value = 'Network error occurred'
  } finally {
    loading.value = false
  }
}

// Toggle word selection
const toggleWordSelection = (wordId: string) => {
  const index = selectedWordIds.value.indexOf(wordId)
  if (index > -1) {
    selectedWordIds.value.splice(index, 1)
  } else {
    selectedWordIds.value.push(wordId)
  }
}

// Select all visible words
const selectAll = () => {
  const visibleWordIds = words.value.map(word => word.id)
  const newSelections = visibleWordIds.filter(id => !selectedWordIds.value.includes(id))
  selectedWordIds.value.push(...newSelections)
}

// Clear all selections
const clearSelection = () => {
  selectedWordIds.value = []
}

// Handle confirm
const handleConfirm = () => {
  const selectedWords = words.value.filter(word => selectedWordIds.value.includes(word.id))
  $emit('select-words', selectedWords)
}

// Load words on mount
onMounted(() => {
  loadWords()
})
</script>