import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Application state
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentLanguage = ref('de') // Default to German as per requirements

  // Actions
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  function clearError() {
    error.value = null
  }

  function setCurrentLanguage(language: string) {
    currentLanguage.value = language
  }

  return {
    // State
    isLoading,
    error,
    currentLanguage,

    // Actions
    setLoading,
    setError,
    clearError,
    setCurrentLanguage,
  }
})
