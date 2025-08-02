<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppLayout>
      <RouterView />
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>
