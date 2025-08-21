<script setup lang="ts">
   import { ref, watch } from 'vue';
   import { useProjectsStore } from '../stores/projects';
   import CustomInput from '../components/CustomInput.vue';
   import CustomSelect from '../components/CustomSelect.vue';
   import NewProjectModal from '../components/NewProjectModal.vue';
   import debounce from 'lodash/debounce';
   import { motion } from 'motion-v'
   import ProjectsTable from '../components/ProjectsTable.vue';

   //===============STORE==================
   const { fetchAllProjects } = useProjectsStore()

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
   <ProjectsTable @sortBy="handleSortBy" :sortBy="sortBy" />
   <NewProjectModal
      :isOpen="isOpen"
      @toggleModal="toggleModal"
      @updateTable="toggleUpdate"
   />
</template>