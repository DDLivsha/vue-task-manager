<script setup lang="ts">
   import { ref, watch, onMounted } from 'vue';
   import { useProjectsStore } from '../stores/projects';
   import CustomInput from '../components/CustomInput.vue';
   import CustomSelect from '../components/CustomSelect.vue';
   import NewProjectModal from '../components/NewProjectModal.vue';
   import debounce from 'lodash/debounce';
   import { motion } from 'motion-v'
   import ProjectsTable from '../components/ProjectsTable.vue';
   import { useRoute, useRouter } from 'vue-router';

   //===============ROUTER==================
   const router = useRouter();
   const route = useRoute();

   //===============STORE==================
   const { fetchAllProjects } = useProjectsStore()

   //===============SEARCH SORT FILTER==================
   const sortBy = ref(String(route.query.sort || 'id'));
   const status = ref(String(route.query.status || ''));
   const localSearch = ref(String(route.query.search || ''));
   const search = ref(localSearch.value);

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

   watch(
      [sortBy, status, search, isNeedUpdate],
      async ([newSort, newStatus, newSearch, _]) => {
         await router.replace({
            query: {
               sort: newSort,
               status: newStatus || undefined,
               search: newSearch || undefined,
            },
         });

         await fetchAllProjects(newSort, newStatus, newSearch);
      }
   );

   onMounted(() => {
      fetchAllProjects(sortBy.value, status.value, search.value);
   });


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
   <ProjectsTable
      @sortBy="handleSortBy"
      :sortBy="sortBy"
   />
   <NewProjectModal
      :isOpen="isOpen"
      @toggleModal="toggleModal"
      @updateTable="toggleUpdate"
   />
</template>