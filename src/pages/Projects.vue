<script setup lang="ts">
   import { useRouter } from 'vue-router';
   import { ref, watch } from 'vue';
   import { useProjectsStore } from '../stores/projects';
   import SortButtons from '../components/SortButtons.vue';
   import CustomInput from '../components/CustomInput.vue';
   import CustomSelect from '../components/CustomSelect.vue';
   import NewProjectModal from '../components/NewProjectModal.vue';
   import { storeToRefs } from 'pinia'
   import debounce from 'lodash/debounce';
   import { motion } from 'motion-v'

   //===============STORE==================
   const store = useProjectsStore()
   const { projects } = storeToRefs(store)
   const { fetchAllProjects } = useProjectsStore()

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
   const localSearch = ref('')
   const search = ref('')
   const isNeedUpdate = ref(false)

   const toggleUpdate = () => {
      isNeedUpdate.value = !isNeedUpdate.value
   }

   watch(() => localSearch.value, debounce(() => {
      search.value = localSearch.value
   }, 500))

   const handleSortBy = (value: string) => {
      sortBy.value = value
   }

   watch([sortBy, status, search, isNeedUpdate], async () => {
      await fetchAllProjects(sortBy.value, status.value, search.value);
   }, { immediate: true });

   //==============NEW PROJECT MODAL=====================
   const isOpen = ref(false)
   const toggleModal = () => {
      isOpen.value = !isOpen.value
   }

</script>

<template>
   <div class="projects__header">
      <h2 class="projects__title">My Projects</h2>
      <div class="projects__search">
         <CustomInput
            v-model="localSearch"
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
            @click="toggleModal"
         >New Project</motion.button>
      </div>
   </div>
   <div class="table__block-overflow">
      <table class="table__table">
         <thead>
            <tr>
               <th>
                  <div class='table__header'>Id
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'id'"
                        :descValue="'-id'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
               <th>
                  <div class='table__header'>Project Title
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'title'"
                        :descValue="'-title'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
               <th>
                  <div class='table__header'>Tasks Quantity
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'tasks_quantity'"
                        :descValue="'-tasks_quantity'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
               <th>
                  <div class='table__header'>Status
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
         </tbody>
      </table>
      <div
         v-if="!projects.length"
         class="table__no-data"
      >No data available.</div>
   </div>
   <NewProjectModal
      :isOpen="isOpen"
      @toggleModal="toggleModal"
      @updateTable="toggleUpdate"
   />
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