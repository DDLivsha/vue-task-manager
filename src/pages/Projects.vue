<script setup lang="ts">
   import SortButtons from '../components/SortButtons.vue';
</script>

<template>
   <div className="globalTable__block-overflow">
      <table className="globalTable__table ">
         <thead>
            <tr>
               <th>
                  <div className='main__sorting-box'>Name
                     <SortButtons />
                  </div>
               </th>
               <th>Email</th>
               <th>Phone</th>
            </tr>
         </thead>
         <tbody>
            <tr>
               <td>
                  sadfsadf
               </td>
               <td>
                  sadfsadf
               </td>
               <td>
                  sadfsadf
               </td>
            </tr>
            <tr>
               <td></td>
               <td>No data available.</td>
               <td></td>
            </tr>
         </tbody>
      </table>
   </div>
</template>
