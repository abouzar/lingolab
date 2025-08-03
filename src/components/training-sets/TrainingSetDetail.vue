<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-4">
        <button
          @click="$emit('back')"
          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">{{ trainingSet.name }}</h1>
          <p v-if="trainingSet.description" class="text-gray-600 mt-1">{{ trainingSet.description }}</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('edit', trainingSet)"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            @click="$emit('delete', trainingSet)"
            class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Metadata -->
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="capitalize">{{ trainingSet.category }}</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>{{ trainingSet.words?.length || 0 }} words</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <span>{{ trainingSet.isPublic ? 'Public' : 'Private' }}</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Created {{ formatDate(trainingSet.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div v-if="stats" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalWords }}</div>
          <div class="text-sm text-gray-600">Total Words</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ stats.averageDifficulty }}/5</div>
          <div class="text-sm text-gray-600">Avg Difficulty</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ stats.estimatedStudyTime }}m</div>
          <div class="text-sm text-gray-600">Study Time</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ formatDate(stats.updatedAt) }}</div>
          <div class="text-sm text-gray-600">Last Updated</div>
        </div>
      </div>
    </div>

    <!-- Words list -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Words</h3>
        <div class="flex gap-2">
          <button
            @click="startStudySession"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5v.01M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
            </svg>
            Study
          </button>
        </div>
      </div>

      <div v-if="!trainingSet.words || trainingSet.words.length === 0" class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p>No words in this training set</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(trainingSetWord, index) in trainingSet.words"
          :key="trainingSetWord.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              {{ index + 1 }}
            </div>
            <div>
              <div class="font-semibold text-gray-900">{{ trainingSetWord.word?.text }}</div>
              <div class="text-sm text-gray-600">
                {{ trainingSetWord.word?.translations?.[0]?.translation || 'No translation' }}
                <span class="mx-2">•</span>
                <span class="capitalize">{{ trainingSetWord.word?.partOfSpeech }}</span>
                <span class="mx-2">•</span>
                <span>Difficulty: {{ trainingSetWord.word?.difficulty }}/5</span>
              </div>
              
              <!-- Word attributes -->
              <div v-if="trainingSetWord.word?.attributes && trainingSetWord.word.attributes.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="attr in trainingSetWord.word.attributes.slice(0, 3)"
                  :key="attr.id"
                  class="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded"
                >
                  {{ attr.attributeType }}: {{ attr.attributeValue }}
                </span>
              </div>
              
              <!-- Example sentence -->
              <div v-if="trainingSetWord.word?.examples && trainingSetWord.word.examples.length > 0" class="mt-2 text-xs text-gray-500">
                <p class="italic">"{{ trainingSetWord.word.examples[0].sentence }}"</p>
                <p class="mt-1">"{{ trainingSetWord.word.examples[0].translation }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TrainingSetApi } from '../../services/trainingSetApi'
import type { TrainingSet } from '../../types'

// Props and emits
const props = defineProps<{
  trainingSet: TrainingSet
}>()

defineEmits<{
  'edit': [trainingSet: TrainingSet]
  'delete': [trainingSet: TrainingSet]
  'back': []
}>()

// Reactive state
const stats = ref<any>(null)

// Load training set statistics
const loadStats = async () => {
  try {
    const response = await TrainingSetApi.getTrainingSetStats(props.trainingSet.id)
    if (response.success && response.data) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Failed to load training set stats:', error)
  }
}

// Start study session (placeholder)
const startStudySession = () => {
  // This would navigate to the flashcard/study view
  // For now, just show an alert
  alert('Study session feature will be implemented in a future task!')
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

// Load stats on mount
onMounted(() => {
  loadStats()
})
</script>