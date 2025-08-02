import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/ChatView.vue'),
      meta: {
        title: 'AI Chat',
      },
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: () => import('@/views/FlashcardsView.vue'),
      meta: {
        title: 'Flashcards',
      },
    },
    {
      path: '/training-sets',
      name: 'training-sets',
      component: () => import('@/views/TrainingSetsView.vue'),
      meta: {
        title: 'Training Sets',
      },
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/ProgressView.vue'),
      meta: {
        title: 'Progress',
      },
    },
  ],
})

// Update document title based on route
router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - LingoLab` : 'LingoLab'
})

export default router
