<script setup lang="ts">
   import { ref } from 'vue';
   import { useCurrentProjectStore } from '../stores/currentProject';
   import SortButtons from '../components/SortButtons.vue';
   import { storeToRefs } from 'pinia'
   import { format } from 'date-fns'
   import draggable from 'vuedraggable';
   import { useRoute } from 'vue-router';

   //===============STORE==================
   const store = useCurrentProjectStore()
   const { project } = storeToRefs(store)
   const { changeProject } = useCurrentProjectStore()
   const projectId = Number(useRoute().params.id);

   //===============SEARCH SORT FILTER==================
   const sortBy = ref('make_until')
   const handleSortBy = (value: string) => {
      sortBy.value = value
   }

   const onUpdate = async () => {
      if (project.value) {
         await changeProject(projectId, project.value);
      }
   };

   const onAdd = async (newStatus: string, e: any) => {
      const task = e.item.__vueParentComponent.props.element; 
      task.status = newStatus;
      if (project.value) {
         await changeProject(projectId, project.value);
      }
   };
</script>

<template>
   <div class="table__block-overflow">
      <!-- TO DO -->
      <div class="table__title">To Do</div>
      <table class="table__table">
         <thead>
            <tr>
               <th>Id</th>
               <th>Title</th>
               <th>Executor</th>
               <th>Make until</th>
            </tr>
         </thead>
         <draggable
            v-model="project!.tasks.tasks_todo"
            group="tasks"
            item-key="id"
            tag="tbody"
            @add="onAdd('to do', $event)"
            @end="onUpdate"
         >
            <template #item="{ element }">
               <tr>
                  <td>{{ element.id }}</td>
                  <td>{{ element.title }}</td>
                  <td>{{ element.executor }}</td>
                  <td>{{ format(new Date(element.make_until), 'dd.MM.yyyy') }}</td>
               </tr>
            </template>
         </draggable>
      </table>
      <div
         v-if="!project?.tasks.tasks_todo.length"
         class="table__no-data"
      >
         No data available.
      </div>

      <!-- IN PROGRESS -->
      <div class="table__title">In Progress</div>
      <table class="table__table">
         <thead>
            <tr>
               <th>Id</th>
               <th>Title</th>
               <th>Executor</th>
               <th>Make until</th>
            </tr>
         </thead>
         <draggable
            v-model="project!.tasks.tasks_in_progress"
            group="tasks"
            item-key="id"
            tag="tbody"
            @add="onAdd('in progress', $event)"
            @end="onUpdate"
         >
            <template #item="{ element }">
               <tr>
                  <td>{{ element.id }}</td>
                  <td>{{ element.title }}</td>
                  <td>{{ element.executor }}</td>
                  <td>{{ format(new Date(element.make_until), 'dd.MM.yyyy') }}</td>
               </tr>
            </template>
         </draggable>
      </table>
      <div
         v-if="!project?.tasks.tasks_in_progress.length"
         class="table__no-data"
      >
         No data available.
      </div>

      <!-- DONE -->
      <div class="table__title">Done</div>
      <table class="table__table">
         <thead>
            <tr>
               <th>Id</th>
               <th>Title</th>
               <th>Executor</th>
               <th>Make until</th>
            </tr>
         </thead>
         <draggable
            v-model="project!.tasks.tasks_done"
            group="tasks"
            item-key="id"
            tag="tbody"
            @add="onAdd('done', $event)"
            @end="onUpdate"
         >
            <template #item="{ element }">
               <tr>
                  <td>{{ element.id }}</td>
                  <td>{{ element.title }}</td>
                  <td>{{ element.executor }}</td>
                  <td>{{ format(new Date(element.make_until), 'dd.MM.yyyy') }}</td>
               </tr>
            </template>
         </draggable>
      </table>
      <div
         v-if="!project?.tasks.tasks_done.length"
         class="table__no-data"
      >
         No data available.
      </div>
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