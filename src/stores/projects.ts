import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectProps } from '../interfaces/project'

export const useProjectsStore = defineStore('projects', () => {
   const projects = ref<ProjectProps[]>([{
      id: 1,
      title: 'Project 1',
      tasks_quantity: 2,
      status: 'to do',
      created_at: '2022-01-01',
   }])
   

   return { projects, }
})
