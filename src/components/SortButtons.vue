<script setup lang="ts">
   interface Props {
      ascValue: string
      descValue: string
      currentValue: string
   }
   interface Emits {
      (e: 'change', value: string): void
   }

   const props = defineProps<Props>()
   const emits = defineEmits<Emits>()

   const onClick = (value: string) => {
      emits('change', value)
   }

</script>

<template>
   <div className='inline-block'>
      <div className='sorting__box'>
         <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="{
               'sorting__arrow': true,
               '--active': currentValue === ascValue
            }"
            @click="onClick(ascValue)"
         >
            <path
               d="M0.676961 7.17387C0.902085 7.41195 1.27614 7.4209 1.51239 7.19373L7.13383 1.78908L12.4918 7.45533C12.7169 7.69342 13.091 7.70237 13.3272 7.4752C13.5635 7.24807 13.5725 6.87093 13.3473 6.63281L7.58162 0.535429C7.4735 0.421083 7.32475 0.35476 7.16808 0.351028C7.01142 0.347296 6.85964 0.406498 6.74623 0.515567L0.697068 6.33148C0.460784 6.55857 0.451798 6.93575 0.676961 7.17387Z"
               fill="#595959"
            />
         </svg>
         <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="{
               'sorting__arrow': true,
               '--rotate': true,
               '--active': currentValue === descValue
            }"
            @click="onClick(descValue)"
         >
            <path
               d="M0.676961 7.17387C0.902085 7.41195 1.27614 7.4209 1.51239 7.19373L7.13383 1.78908L12.4918 7.45533C12.7169 7.69342 13.091 7.70237 13.3272 7.4752C13.5635 7.24807 13.5725 6.87093 13.3473 6.63281L7.58162 0.535429C7.4735 0.421083 7.32475 0.35476 7.16808 0.351028C7.01142 0.347296 6.85964 0.406498 6.74623 0.515567L0.697068 6.33148C0.460784 6.55857 0.451798 6.93575 0.676961 7.17387Z"
               fill="#595959"
            />
         </svg>
      </div>
   </div>
</template>

<style scoped lang="scss">
   .sorting__box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: fit-content;
   }

   .sorting__arrow {
      transition: fill .3s ease;
      cursor: pointer;

      &.--active {
         path {
            fill: #EE2835;
         }
      }

      &.--rotate {
         transform: rotate(180deg);
      }
   }

</style>