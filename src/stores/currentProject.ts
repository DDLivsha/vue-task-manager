import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectProps } from '../interfaces/project'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export interface FiltersProps {
   sortBy: string
   status?: string
   title?: string
}

export const useCurrentProjectStore = defineStore('currentProject', () => {
   const project = ref<ProjectProps>()

   const fetchCurrentProject = async (id: number) => {
      try {

         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`)

         project.value = data

      } catch (error) {
         if (error instanceof Error) {
            console.error(error?.message)
            useToast().error(error?.message)
         } else {
            console.error('Unexpected error', error)
            useToast().error('An unexpected error occurred')
         }
      }
   }
   const changeProject = async (id: number, newProject: ProjectProps) => {
      try {

         if (newProject.tasks.tasks_in_progress.length > 0){
               newProject.status = 'in progress'
            } else if (!newProject.tasks.tasks_todo.length && !newProject.tasks.tasks_in_progress.length) {
               newProject.status = 'done'
            } else if (!newProject.tasks.tasks_in_progress.length && !newProject.tasks.tasks_done.length) {
               newProject.status = 'to do'
            }

         const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/projects/${id}`, { ...newProject })

      } catch (error) {
         if (error instanceof Error) {
            console.error(error?.message)
            useToast().error(error?.message)
         } else {
            console.error('Unexpected error', error)
            useToast().error('An unexpected error occurred')
         }
      }
   }

   return { project, fetchCurrentProject, changeProject }
})
