import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../pages/Projects.vue'),
    },
    {
      path: '/:id',
      component: () => import('../pages/CurrentProject.vue'),
    },
  ],
})

export default router
