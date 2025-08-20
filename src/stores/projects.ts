import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectProps } from '../interfaces/project'
import axios from 'axios'

export interface FiltersProps {
   sortBy: string
   status?: string
   title?: string
}

export const useProjectsStore = defineStore('projects', () => {
   const projects = ref<ProjectProps[]>([])
   const currentProject = ref<ProjectProps | null>(null)

   const fetchAllProjects = async (sortBy: string, status?: string, search?: string) => {
      try {
         const params: FiltersProps = { sortBy: sortBy }

         if (search) {
            params.title = `*${search}*`
         }

         if (status) {
            params.status = status
         }

         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, { params })

         projects.value = data

      } catch (error) {
         if (error instanceof Error) {
            console.error(error?.message)
            alert(error?.message)
         } else {
            console.error('Unexpected error', error)
            alert('An unexpected error occurred')
         }
      }
   }

   return { projects, currentProject, fetchAllProjects }
})
