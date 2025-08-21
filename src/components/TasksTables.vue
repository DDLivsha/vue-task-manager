<script setup lang="ts">
   import { useCurrentProjectStore } from '../stores/currentProject';
   import { storeToRefs } from 'pinia'
   import { format } from 'date-fns'
   import draggable from 'vuedraggable';
   import { useRoute } from 'vue-router';
   import { ref, onMounted, onBeforeUnmount } from 'vue';

   //===============STORE==================
   const store = useCurrentProjectStore()
   const { project } = storeToRefs(store)
   const { changeProject } = useCurrentProjectStore()
   const projectId = Number(useRoute().params.id);

   //===============DRAG AND DROP==================
   const onTaskChange = async (event: any, newStatus: string) => {
      if (event.added) {
         const addedTask = event.added.element;
         addedTask.status = newStatus;

         if (project.value) {
            changeProject(projectId, project.value);
         }
      } else if (event.moved) {
         if (project.value) {
            changeProject(projectId, project.value);
         }
      }
   };

   //===============RESIZE COLUMNS==================
   const COL_COUNT = 4

   const colWidths = ref<number[]>(Array(COL_COUNT).fill(0))

   const thRefs: Array<HTMLElement | null> = Array(COL_COUNT).fill(null)
   const setThRef = (index: number) => (el: HTMLElement | null) => { thRefs[index] = el }

   const MIN_WIDTH = 70

   let resizing = false
   let resizeColIndex = -1
   let startX = 0
   let startWidths: number[] = []

   const clamp = (v: number, min: number) => Math.max(v, min)

   const startResize = (e: MouseEvent, index: number) => {
      e.preventDefault()
      if (e.button !== 0) return

      resizing = true
      resizeColIndex = index
      startX = e.clientX
      startWidths = colWidths.value.slice()
      document.body.style.cursor = 'col-resize'
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', stopResize)
   }

   const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return
      const dx = e.clientX - startX

      const i = resizeColIndex
      const next = i + 1
      if (next < COL_COUNT) {
         const newWidth = clamp(startWidths[i] + dx, MIN_WIDTH)
         const neighborNew = clamp(startWidths[next] - (newWidth - startWidths[i]), MIN_WIDTH)

         if (neighborNew === MIN_WIDTH) {
            const allowedDx = startWidths[next] - MIN_WIDTH
            const allowedNewWidth = startWidths[i] + allowedDx
            colWidths.value[i] = clamp(allowedNewWidth, MIN_WIDTH)
            colWidths.value[next] = MIN_WIDTH
         } else {
            colWidths.value[i] = newWidth
            colWidths.value[next] = neighborNew
         }
      } else {
         colWidths.value[i] = clamp(startWidths[i] + dx, MIN_WIDTH)
      }
   }

   const stopResize = () => {
      if (!resizing) return
      resizing = false
      resizeColIndex = -1
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopResize)
   }

   onMounted(() => {
      requestAnimationFrame(() => {
         for (let i = 0; i < COL_COUNT; i++) {
            const th = thRefs[i]
            if (th) {
               const rect = th.getBoundingClientRect()
               colWidths.value[i] = Math.round(rect.width) || 100
            } else {
               colWidths.value[i] = 120
            }
         }
      })
   })

   onBeforeUnmount(() => {
      stopResize()
   })
</script>

<template>
   <div class="table__block-overflow">
      <!-- TO DO -->
      <div class="table__title">To Do</div>
      <table class="table__table">
         <colgroup>
            <col :style="{ width: colWidths[0] + 'px' }" />
            <col :style="{ width: colWidths[1] + 'px' }" />
            <col :style="{ width: colWidths[2] + 'px' }" />
            <col :style="{ width: colWidths[3] + 'px' }" />
         </colgroup>
         <thead>
            <tr>
               <th
                  class="relative"
                  ref="setThRef(0)"
               >Id
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 0)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(1)"
               >Title
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 1)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(2)"
               >Executor
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 2)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(3)"
               >Make until
               </th>
            </tr>
         </thead>
         <draggable
            v-model="project!.tasks.tasks_todo"
            group="tasks"
            item-key="id"
            tag="tbody"
            @change="onTaskChange($event, 'to do')"
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
         <colgroup>
            <col :style="{ width: colWidths[0] + 'px' }" />
            <col :style="{ width: colWidths[1] + 'px' }" />
            <col :style="{ width: colWidths[2] + 'px' }" />
            <col :style="{ width: colWidths[3] + 'px' }" />
         </colgroup>
         <thead>
            <tr>
               <th
                  class="relative"
                  ref="setThRef(0)"
               >Id
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 0)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(1)"
               >Title
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 1)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(2)"
               >Executor
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 2)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(3)"
               >Make until
               </th>
            </tr>
         </thead>
         <draggable
            v-model="project!.tasks.tasks_in_progress"
            group="tasks"
            item-key="id"
            tag="tbody"
            @change="onTaskChange($event, 'in progress')"
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
         <colgroup>
            <col :style="{ width: colWidths[0] + 'px' }" />
            <col :style="{ width: colWidths[1] + 'px' }" />
            <col :style="{ width: colWidths[2] + 'px' }" />
            <col :style="{ width: colWidths[3] + 'px' }" />
         </colgroup>
         <thead>
            <tr>
               <th
                  class="relative"
                  ref="setThRef(0)"
               >Id
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 0)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(1)"
               >Title
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 1)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(2)"
               >Executor
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 2)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(3)"
               >Make until
               </th>
            </tr>
         </thead>
         <draggable
            v-model="project!.tasks.tasks_done"
            group="tasks"
            item-key="id"
            tag="tbody"
            @change="onTaskChange($event, 'done')"
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