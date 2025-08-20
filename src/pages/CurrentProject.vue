<script setup lang="ts">
   import { useRoute } from 'vue-router';
   import { onMounted, ref } from 'vue';
   import { useCurrentProjectStore } from '../stores/currentProject';
   import CustomSelect from '../components/CustomSelect.vue';
   import { storeToRefs } from 'pinia'
   import { motion } from 'motion-v'
   import { executors } from '../constants/executors';
   import NewTaskModal from '../components/NewTaskModal.vue';
   import TasksTables from '../components/TasksTables.vue';

   //===============STORE==================
   const store = useCurrentProjectStore()
   const { project } = storeToRefs(store)
   const { fetchCurrentProject, changeProject } = useCurrentProjectStore()

   //===============PARAMS PROJECT ID==================
   const projectId = useRoute().params.id

   //===============SEARCH SORT FILTER==================
   const name = ref('')

   onMounted(() => {
      fetchCurrentProject(Number(projectId));
   })

   //==============NEW PROJECT MODAL=====================
   const isOpen = ref(false)
   const toggleModal = () => {
      isOpen.value = !isOpen.value
   }

</script>

<template>
   <div class="projects__header">
      <div class="projects__search">
         <router-link
            class="arrow__back"
            to="/"
         >
            <svg
               width="16"
               height="14"
               viewBox="0 0 16 14"
               fill="none"
               stroke="#3d5bc0"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  d="M1 7H14.7143"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
               <path
                  d="M8.71436 1L14.7144 7L8.71436 13"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
               />
            </svg>
         </router-link>
         <h2 class="projects__title">{{ project ? project.title : '' }}</h2>
      </div>
      <div class="projects__search">
         <div class="filler"></div>
         <CustomSelect
            v-model="name"
            :options="executors"
            placeholder="Filter by executor"
         />
         <motion.button
            type="button"
            class="btn"
            :whileHover="{ scale: 1.05 }"
            :whilePress="{ scale: 0.95 }"
            @click="toggleModal"
         >New Task</motion.button>
      </div>
   </div>

   <TasksTables />
   <NewTaskModal
      :isOpen="isOpen"
      @toggleModal="toggleModal"
   />
</template>

<style scoped lang="scss">
   .arrow__back {
      transform: rotate(180deg);
   }

   .filler {
      flex-grow: 1;
   }
</style>