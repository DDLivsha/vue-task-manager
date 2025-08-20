<script setup lang="ts">
   import { AnimatePresence, motion } from 'motion-v';
   import { watch, onBeforeUnmount, reactive, ref } from 'vue'
   import CustomInput from './CustomInput.vue';
   import CustomSelect from './CustomSelect.vue';
   import { useCurrentProjectStore } from '../stores/currentProject';
   import { storeToRefs } from 'pinia'
   import { executors } from '../constants/executors';
   import { useRoute } from 'vue-router';
   import type { TaskProps } from '../interfaces/task';
   import { generateId } from '../helpers/generateId';

   const props = defineProps<{
      isOpen: boolean,
   }>()
   const emit = defineEmits<{
      (e: 'toggleModal'): void;
   }>()

   //===============STORE==================
   const store = useCurrentProjectStore()
   const { project } = storeToRefs(store)
   const { changeProject } = useCurrentProjectStore()
   const projectId = Number(useRoute().params.id)

   //==============HANDLE OVERLAY=====================
   watch(() => props.isOpen, (newVal) => {
      document.body.style.overflow = newVal ? 'hidden' : 'auto'
   })
   onBeforeUnmount(() => {
      document.body.style.overflow = 'auto'
   })
   //==============FORM FUNCTIONS=================
   const data = reactive<TaskProps>({
      id: 0,
      title: '',
      executor: '',
      project_id: 0,
      status: 'to do',
      make_until: '',
   })
   const isError = ref(false)

   const handleReset = () => {
      emit('toggleModal')
      isError.value = false
      data.title = ''
      data.executor = ''
      data.make_until = ''
      data.status = 'to do'
   }

   const handleCreateTask = async () => {
      try {
         data.title = data.title.trim();
         data.id = generateId()
         data.project_id = projectId

         if (!data.title || !data.executor || !data.make_until || !data.status) {
            isError.value = true
            return
         } else {

            if (project.value) {

               let taskKey: 'tasks_todo' | 'tasks_in_progress' | 'tasks_done' = 'tasks_todo'

               if (data.status === 'to do') {
                  taskKey = 'tasks_todo'
               } else if (data.status === 'in progress') {
                  taskKey = 'tasks_in_progress'
               } else if (data.status === 'done') {
                  taskKey = 'tasks_done'
               }

               if (project.value.tasks[taskKey]) {
                  project.value.tasks[taskKey].push({ ...data, make_until: new Date(data.make_until).toISOString() });

                  project.value.tasks_quantity = project.value.tasks.tasks_todo.length + project.value.tasks.tasks_in_progress.length + project.value.tasks.tasks_done.length

                  await changeProject(projectId, project.value);
                  alert('Project created successfully')
                  handleReset()
               }

            }
         }
      } catch (error) {
         console.error(error)
      }
   }

</script>

<template>
   <AnimatePresence>
      <motion.div
         :initial="{ opacity: 0 }"
         :animate="{ opacity: 1 }"
         :exit="{ opacity: 0 }"
         @click="handleReset"
         v-if="isOpen"
         class="overlay"
      >
      </motion.div>
      <motion.div
         :initial="{ opacity: 0 }"
         :animate="{ opacity: 1 }"
         :exit="{ opacity: 0 }"
         v-if="isOpen"
         class="modal"
      >
         <div class="modal__header">
            <h2>Create New Task</h2>
            <img
               src="/close.svg"
               alt="close modal"
               @click="handleReset"
               class="close-modal"
            />
         </div>
         <div class="grid">
            <CustomInput
               v-model="data.title"
               placeholder="Title"
               :error="(isError && !data.title) ? 'You need to add a title' : ''"
            />
            <CustomSelect
               v-model="data.executor"
               :options="executors"
               placeholder="Select an executor"
               :error="(isError && !data.executor) ? 'You need to add an executor' : ''"
            />
            <CustomSelect
               v-model="data.status"
               :options="['to do', 'in progress', 'done']"
               placeholder="Select status"
               :error="(isError && !data.status) ? 'You need to add a status' : ''"
            />
            <CustomInput
               v-model="data.make_until"
               type="date"
               placeholder="Make until"
               :error="(isError && !data.make_until) ? 'You need to choose a date' : ''"
            />
            <motion.button
               type="button"
               class="btn"
               :whileHover="{ scale: 1.05 }"
               :whilePress="{ scale: 0.95 }"
               @click="handleCreateTask"
            >Create Task</motion.button>
         </div>
      </motion.div>
   </AnimatePresence>
</template>

<style scoped lang="scss">
   .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      @media (max-width: 600px) {
         grid-template-columns: 1fr;
      }
   }
</style>