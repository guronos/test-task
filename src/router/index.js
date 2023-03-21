import { createRouter, createWebHashHistory } from 'vue-router'
import AboutMe from '@/views/AboutMe'
import FunctionalTask from '@/views/FunctionalTask'

const routes = [
  {
    path: '/',
    name: 'AboutMe',
    component: AboutMe
  },
  {
    path: '/task',
    name: 'FunctionalTask',
    component: FunctionalTask

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
