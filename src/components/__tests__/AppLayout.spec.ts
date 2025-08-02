import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

// Create a mock router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
})

describe('AppLayout', () => {
  it('renders properly', () => {
    const wrapper = mount(AppLayout, {
      global: {
        plugins: [router],
      },
      slots: {
        default: '<div>Test Content</div>',
      },
    })

    expect(wrapper.text()).toContain('LingoLab')
    expect(wrapper.text()).toContain('Test Content')
  })

  it('displays navigation items', () => {
    const wrapper = mount(AppLayout, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('AI Chat')
    expect(wrapper.text()).toContain('Flashcards')
    expect(wrapper.text()).toContain('Training Sets')
    expect(wrapper.text()).toContain('Progress')
  })
})
