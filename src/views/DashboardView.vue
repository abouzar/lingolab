<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome to your language learning journey</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Quick Stats Cards -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Words Learned</h3>
        <p class="text-3xl font-bold text-primary-600">0</p>
        <p class="text-sm text-gray-500 mt-1">Keep going!</p>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Study Streak</h3>
        <p class="text-3xl font-bold text-secondary-600">0</p>
        <p class="text-sm text-gray-500 mt-1">days</p>
      </div>

      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Training Sets</h3>
        <p class="text-3xl font-bold text-purple-600">0</p>
        <p class="text-sm text-gray-500 mt-1">created</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink
          to="/chat"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">Start Chat</h3>
            <p class="text-sm text-gray-500 mt-1">Practice with AI</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/flashcards"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-secondary-100 rounded-lg mx-auto mb-3 flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">Study Cards</h3>
            <p class="text-sm text-gray-500 mt-1">Review vocabulary</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/training-sets"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">Manage Sets</h3>
            <p class="text-sm text-gray-500 mt-1">Create word lists</p>
          </div>
        </RouterLink>

        <RouterLink
          to="/progress"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
        >
          <div class="text-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3 flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
            </div>
            <h3 class="font-medium text-gray-900">View Progress</h3>
            <p class="text-sm text-gray-500 mt-1">Track learning</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard logic will be implemented in later tasks
</script>
