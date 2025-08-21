<script setup lang="ts">
   import { BarChart } from 'vue-chart-3'
   import { Chart, registerables } from 'chart.js'
   import { useProjectsStore } from '../stores/projects';
   import { storeToRefs } from 'pinia'
   import { computed } from 'vue'

   Chart.register(...registerables)

   //===============STORE==================
   const store = useProjectsStore()
   const { tasksQtts } = storeToRefs(store)

   const chartData = computed(() => {
      return {
         labels: ['To do', 'In progress', 'Done'],
         datasets: [
            {
               label: 'Tasks',
               data: tasksQtts.value,
               backgroundColor: ['#f87171', '#facc15', '#4ade80']
            }
         ]
      }
   })

   const chartOptions = {
      responsive: true,
      plugins: {
         legend: { display: false }
      }
   }
</script>

<template>
   <BarChart
      v-if="tasksQtts.length"
      :chart-data="chartData"
      :chart-options="chartOptions"
   />
</template>