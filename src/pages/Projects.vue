<script setup lang="ts">
   import { useRouter } from 'vue-router';
   import { useProjectsStore } from '../stores/projects';
   const { projects } = useProjectsStore()

   const router = useRouter()

   const handleClick = (event: MouseEvent, path: string) => {

      if (event.ctrlKey || event.metaKey || event.button === 1) {
         window.open(path, '_blank')
         return
      }

      router.push(path)
   }
</script>

<template>
   <div className="table__block-overflow">
      <table className="table__table">
         <thead>
            <tr>
               <th>
                  <div className='table__header'>Id
                     <!-- <SortButtons /> -->
                  </div>
               </th>
               <th>
                  <div className='table__header'>Project Title
                     <!-- <SortButtons /> -->
                  </div>
               </th>
               <th>
                  <div className='table__header'>Tasks Quantity
                     <!-- <SortButtons /> -->
                  </div>
               </th>
               <th>
                  <div className='table__header'>Status
                     <!-- <SortButtons /> -->
                  </div>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr
               v-for="item in projects"
               :key="item.id"
               v-if="projects.length"
               :to="'/' + item.id"
               @click.prevent="handleClick($event, '/' + item.id)"
            >
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td>
                  {{ item.tasks_quantity }}
               </td>
               <td class='table__status'>
                  {{ item.status }}
               </td>
            </tr>
            <tr v-else>
               <td></td>
               <td>No data available.</td>
               <td></td>
            </tr>
         </tbody>
      </table>
   </div>
</template>
