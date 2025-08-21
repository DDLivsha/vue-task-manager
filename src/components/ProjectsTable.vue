<script setup lang="ts">
   import { useRouter } from 'vue-router';
   import { ref, onMounted, onBeforeUnmount } from 'vue';
   import { useProjectsStore } from '../stores/projects';
   import SortButtons from '../components/SortButtons.vue';
   import { storeToRefs } from 'pinia'
   import { format } from 'date-fns'

   const emits = defineEmits<{ (e: 'sortBy', value: string): void }>()
   defineProps<{
      sortBy: string
   }>()

   //===============STORE==================
   const store = useProjectsStore()
   const { projects } = storeToRefs(store)

   //============ROUTER FOR OPEN PROJECT===============
   const router = useRouter()

   const handleClick = (event: MouseEvent, path: string) => {
      if (event.ctrlKey || event.metaKey || event.button === 1) {
         window.open(path, '_blank')
         return
      }
      router.push(path)
   }

   //===============RESIZE COLUMNS==================
   const COL_COUNT = 5

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
      <table class="table__table">
         <colgroup>
            <col :style="{ width: colWidths[0] + 'px' }" />
            <col :style="{ width: colWidths[1] + 'px' }" />
            <col :style="{ width: colWidths[2] + 'px' }" />
            <col :style="{ width: colWidths[3] + 'px' }" />
            <col :style="{ width: colWidths[4] + 'px' }" />
         </colgroup>
         <thead>
            <tr>
               <th
                  class="relative"
                  ref="setThRef(0)"
               >
                  <div class='table__header'>Id
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'id'"
                        :descValue="'-id'"
                        @change="emits('sortBy', $event)"
                     />
                  </div>
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
               >
                  <div class='table__header'>Project Title
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'title'"
                        :descValue="'-title'"
                        @change="emits('sortBy', $event)"
                     />
                  </div>
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
               >
                  <div class='table__header'>Tasks Quantity
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'tasks_quantity'"
                        :descValue="'-tasks_quantity'"
                        @change="emits('sortBy', $event)"
                     />
                  </div>
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
               >
                  <div class='table__header'>Status
                     <SortButtons
                        :currentValue="sortBy"
                        :ascValue="'status'"
                        :descValue="'-status'"
                        @change="emits('sortBy', $event)"
                     />
                  </div>
                  <img
                     src="/arrows.png"
                     alt="width arrows"
                     width="18px"
                     class="width__arrows"
                     @mousedown.prevent="startResize($event, 3)"
                  >
               </th>
               <th
                  class="relative"
                  ref="setThRef(4)"
               >
                  <div class='table__header'>Created At</div>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr
               v-for="item in projects"
               :key="item.id"
               v-if="projects.length"
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
               <td class='table__status'>
                  {{ format(new Date(item.created_at), 'dd.MM.yyyy') }}
               </td>
            </tr>
         </tbody>
      </table>
      <div
         v-if="!projects.length"
         class="table__no-data"
      >No data available.</div>
   </div>
</template>