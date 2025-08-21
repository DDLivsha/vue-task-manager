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

export const useProjectsStore = defineStore('projects', () => {
   const projects = ref<ProjectProps[]>([])
   const tasksQtts = ref([])

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

       if (!search && !status) {tasksQtts.value = [
            data.reduce((acc, project) => acc + project.tasks.tasks_todo.length, 0),
            data.reduce((acc, project) => acc + project.tasks.tasks_in_progress.length, 0),
            data.reduce((acc, project) => acc + project.tasks.tasks_done.length, 0),
         ]}

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

   const createProject = async (newProject: ProjectProps) => {
      try {

         const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/projects`, { ...newProject })

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

   return { projects, fetchAllProjects, createProject, tasksQtts }
})
