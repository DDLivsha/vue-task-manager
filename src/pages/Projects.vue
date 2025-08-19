<script setup lang="ts">
   import { useRouter } from 'vue-router';
   import { useProjectsStore } from '../stores/projects';
   import { ref } from 'vue';
   import SortButtons from '../components/SortButtons.vue';
   import CustomInput from '../components/CustomInput.vue';
   import debounce from 'lodash/debounce';
   import { motion } from 'motion-v'
   import CustomSelect from '../components/CustomSelect.vue';

   //===============STORE==================
   const { projects } = useProjectsStore()

   //============ROUTER FOR OPEN PROJECT===============
   const router = useRouter()
   const handleClick = (event: MouseEvent, path: string) => {
      if (event.ctrlKey || event.metaKey || event.button === 1) {
         window.open(path, '_blank')
         return
      }
      router.push(path)
   }

   //===============SEARCH SORT FILTER==================
   const sortBy = ref('id')
   const status = ref('')
   const search = ref('')

   const handleSortBy = (value: string) => {
      sortBy.value = value
   }
</script>

<template>
   <div class="projects__header">
      <h2 class="projects__title">My Projects</h2>
      <div class="projects__search">
         <CustomInput
            v-model="search"
            placeholder="Search..."
         />
         <CustomSelect
            v-model="status"
            :options="['to do', 'in progress', 'done']"
            placeholder="Status"
         />
         <motion.button
            type="button"
            class="btn"
            :whileHover="{ scale: 1.05 }"
            :whilePress="{ scale: 0.95 }"
         >New Project</motion.button>
      </div>
   </div>
   <div className="table__block-overflow">
      <table className="table__table">
         <thead>
            <tr>
               <th>
                  <div className='table__header'>Id
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'id'"
                        :descValue="'-id'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
               <th>
                  <div className='table__header'>Project Title
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'title'"
                        :descValue="'-title'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
               <th>
                  <div className='table__header'>Tasks Quantity
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'tasks_quantity'"
                        :descValue="'-tasks_quantity'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
               <th>
                  <div className='table__header'>Status
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'status'"
                        :descValue="'-status'"
                        @change="handleSortBy"
                     />
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

<style scoped lang="scss">
   .projects {
      &__header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 20px;
      }

      &__search {
         display: flex;
         gap: 8px;
         flex: 1;
         max-width: 600px;
         align-items: center; 
      }

      &__title {
         font-size: 24px;
         font-weight: 600;
      }
   }
</style>