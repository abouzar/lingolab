import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  username: string
  targetLanguage: string
  nativeLanguage: string
  createdAt: Date
  preferences: {
    dailyGoal: number
    notificationsEnabled: boolean
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
    preferredStudyTime: string
  }
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Getters
  const currentUser = computed(() => user.value)
  const userLanguage = computed(() => user.value?.targetLanguage || 'de')

  // Actions
  function setUser(userData: User) {
    user.value = userData
    isAuthenticated.value = true
  }

  function clearUser() {
    user.value = null
    isAuthenticated.value = false
  }

  function updateUserPreferences(preferences: Partial<User['preferences']>) {
    if (user.value) {
      user.value.preferences = { ...user.value.preferences, ...preferences }
    }
  }

  return {
    // State
    user,
    isAuthenticated,

    // Getters
    currentUser,
    userLanguage,

    // Actions
    setUser,
    clearUser,
    updateUserPreferences,
  }
})
