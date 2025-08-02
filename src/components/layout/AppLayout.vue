<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar Navigation -->
    <AppNavigation />

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto">
      <div class="container mx-auto px-6 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
</script>
