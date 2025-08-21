<script setup lang="ts">
   import { AnimatePresence, motion } from 'motion-v';
   import { watch, onBeforeUnmount, reactive, ref } from 'vue'
   import type { ProjectProps } from '../interfaces/project';
   import CustomInput from './CustomInput.vue';
   import CustomTextArea from './CustomTextArea.vue';
   import { useProjectsStore } from '../stores/projects';
   import { useToast } from 'vue-toastification'
   
   const props = defineProps<{
      isOpen: boolean,
   }>()
   const emit = defineEmits<{
      (e: 'toggleModal'): void;
      (e: 'updateTable'): void
   }>()

   const { createProject } = useProjectsStore()

   //==============HANDLE OVERLAY=====================
   watch(() => props.isOpen, (newVal) => {
      document.body.style.overflow = newVal ? 'hidden' : 'auto'
   })
   onBeforeUnmount(() => {
      document.body.style.overflow = 'auto'
   })
   //==============FORM FUNCTIONS=================
   const data = reactive<ProjectProps>({
      title: '',
      tasks_quantity: 0,
      description: '',
      tasks: {
         tasks_todo: [],
         tasks_in_progress: [],
         tasks_done: [],
      },
      status: 'to do',
      created_at: '',
   })
   const isError = ref(false)

   const handleReset = () => {
      emit('toggleModal')
      isError.value = false
      data.title = ''
      data.description = ''
   }

   const handleCreateProject = async () => {
      try {
         data.title = data.title.trim();
         data.description = data.description.trim();
         data.created_at = new Date().toISOString();
         if (!data.title) {
            isError.value = true
            return
         } else {
            await createProject(data)
            useToast().success('Project created successfully')
            handleReset()
            emit('updateTable')
         }
      } catch (error) {
         console.error(error)
         useToast().error('Something went wrong')
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
         class="modal__wrapper"
         :initial="{ opacity: 0 }"
         :animate="{ opacity: 1 }"
         :exit="{ opacity: 0 }"
         v-if="isOpen"
      >
         <div class="modal">
            <div class="modal__header">
               <h2>Create New Project</h2>
               <img
                  src="/close.svg"
                  alt="close modal"
                  @click="handleReset"
                  class="close-modal"
               />
            </div>
            <div class="flex">
               <CustomInput
                  v-model="data.title"
                  placeholder="Title"
                  :error="(isError && !data.title) ? 'You need to add a title' : ''"
               />
               <CustomTextArea
                  v-model="data.description"
                  placeholder="Description"
               />
               <motion.button
                  type="button"
                  class="btn"
                  :whileHover="{ scale: 1.05 }"
                  :whilePress="{ scale: 0.95 }"
                  @click="handleCreateProject"
               >Create Project</motion.button>
            </div>
            <div></div>
         </div>
         </motion.div>
   </AnimatePresence>
</template>

<style scoped lang="scss">
   .flex {
      display: flex;
      flex-direction: column;
      gap: 16px;
   }
</style>