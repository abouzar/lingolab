<template>
  <nav class="w-64 bg-white shadow-lg">
    <div class="p-6">
      <h1 class="text-2xl font-bold text-primary-600">LingoLab</h1>
      <p class="text-sm text-gray-600 mt-1">Language Learning Platform</p>
    </div>

    <div class="px-6">
      <ul class="space-y-2">
        <li v-for="item in navigationItems" :key="item.name">
          <RouterLink
            :to="item.path"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            :class="{
              'bg-primary-50 text-primary-700 border-r-2 border-primary-600':
                $route.path === item.path,
            }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Simple icon components (we'll use these until we add a proper icon library)
const DashboardIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
}
const ChatIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
}
const FlashcardIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
}
const TrainingIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
}
const ProgressIcon = {
  template:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>',
}

const navigationItems = computed(() => [
  { name: 'Dashboard', path: '/', icon: DashboardIcon },
  { name: 'AI Chat', path: '/chat', icon: ChatIcon },
  { name: 'Flashcards', path: '/flashcards', icon: FlashcardIcon },
  { name: 'Training Sets', path: '/training-sets', icon: TrainingIcon },
  { name: 'Progress', path: '/progress', icon: ProgressIcon },
])
</script>
