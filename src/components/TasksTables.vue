<script setup lang="ts">
   import { onMounted, ref } from 'vue';
   import { useCurrentProjectStore } from '../stores/currentProject';
   import SortButtons from '../components/SortButtons.vue';
   import { storeToRefs } from 'pinia'
   import { format } from 'date-fns'

   //===============STORE==================
   const store = useCurrentProjectStore()
   const { project } = storeToRefs(store)
   const { changeProject } = useCurrentProjectStore()

   //===============SEARCH SORT FILTER==================
   const sortBy = ref('make_until')
   const handleSortBy = (value: string) => {
      sortBy.value = value
   }
</script>

<template>
   <div class="table__block-overflow">
      <div class="table__title">To Do</div>
      <table class="table__table">
         <thead>
            <tr>
               <th>
                  <div class='table__header'>Id</div>
               </th>
               <th>
                  <div class='table__header'>Title</div>
               </th>
               <th>
                  <div class='table__header'>Executor</div>
               </th>
               <th>
                  <div class='table__header'>Make until
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'make_until'"
                        :descValue="'-make_until'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr
               v-for="item in project?.tasks.tasks_todo"
               :key="item.id"
               v-if="project?.tasks.tasks_todo.length"
            >
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td>
                  {{ item.executor }}
               </td>
               <td>
                  {{ format(new Date(item.make_until), 'dd.MM.yyyy') }}
               </td>
            </tr>
         </tbody>
      </table>
      <div
         v-if="!project?.tasks.tasks_todo.length"
         class="table__no-data"
      >No data available.</div>
      <!-- in progress table -->
      <div class="table__title">In Progress</div>
      <table class="table__table">
         <thead>
            <tr>
               <th>
                  <div class='table__header'>Id</div>
               </th>
               <th>
                  <div class='table__header'>Title</div>
               </th>
               <th>
                  <div class='table__header'>Executor</div>
               </th>
               <th>
                  <div class='table__header'>Make until
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'make_until'"
                        :descValue="'-make_until'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr
               v-for="item in project?.tasks.tasks_in_progress"
               :key="item.id"
               v-if="project?.tasks.tasks_in_progress.length"
            >
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td>
                  {{ item.executor }}
               </td>
               <td>
                  {{ format(new Date(item.make_until), 'dd.MM.yyyy') }}
               </td>
            </tr>
         </tbody>
      </table>
      <div
         v-if="!project?.tasks.tasks_in_progress.length"
         class="table__no-data"
      >No data available.</div>
      <!-- done table -->
      <div class="table__title">Done</div>
      <table class="table__table">
         <thead>
            <tr>
               <th>
                  <div class='table__header'>Id</div>
               </th>
               <th>
                  <div class='table__header'>Title</div>
               </th>
               <th>
                  <div class='table__header'>Executor</div>
               </th>
               <th>
                  <div class='table__header'>Make until
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'make_until'"
                        :descValue="'-make_until'"
                        @change="handleSortBy"
                     />
                  </div>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr
               v-for="item in project?.tasks.tasks_done"
               :key="item.id"
               v-if="project?.tasks.tasks_done.length"
            >
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td>
                  {{ item.executor }}
               </td>
               <td>
                  {{ format(new Date(item.make_until), 'dd.MM.yyyy') }}
               </td>
            </tr>
         </tbody>
      </table>
      <div
         v-if="!project?.tasks.tasks_done.length"
         class="table__no-data"
      >No data available.</div>
   </div>
</template>

<style scoped lang="scss">
   .table__title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #3E3A3B;
      display: flex;
      justify-content: center;

      &:not(:first-child) {
         margin-top: 24px;
      }
   }
</style>