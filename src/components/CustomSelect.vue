<script setup lang="ts">
   import { ref, defineProps, defineEmits } from 'vue'

   const props = defineProps<{
      modelValue: string
      options: string[]
      error?: string
      placeholder?: string
   }>()

   const emit = defineEmits(['update:modelValue'])

   const open = ref(false)

   const toggle = () => {
      open.value = !open.value
   }

   const select = (option: string) => {
      emit('update:modelValue', option)
      open.value = false
   }
</script>

<template>
   <div
      class="select"
      :class="{ 'has-error': !!error }"
   >
      <div
         class="select__box"
         :class="{ '--error': !!error }"
         @click="toggle"
      >
         <span v-if="modelValue">{{ modelValue }}</span>
         <span
            class="placeholder"
            v-else
         >{{ placeholder }}</span>
         <svg
            class="arrow"
            :class="{ '--rotate': open }"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               d="M7 10l5 5 5-5"
               stroke="currentColor"
               stroke-width="2"
            />
         </svg>
      </div>

      <ul
         v-if="open"
         class="select__options"
      >
         <li
            @click="select('')"
            class="select__option placeholder"
         >
            Clear
         </li>
         <li
            v-for="option in options"
            :key="option"
            @click="select(option)"
            class="select__option"
         >
            {{ option }}
         </li>
      </ul>

      <p
         v-if="error"
         class="error"
      >{{ error }}</p>
   </div>
</template>

<style scoped lang="scss">
   .select {
      position: relative;
      font-family: sans-serif;
      width: 100%;

      &__box {
         border: 1px solid #ccc;
         padding: 8px 16px;
         font-size: 16px;
         border-radius: 6px;
         cursor: pointer;
         display: flex;
         justify-content: space-between;
         align-items: center;
         height: 35px;
         text-transform: capitalize;

         &.--error {
            border-color: red;
         }

         &:hover {
            border-color: #666;
         }
      }

      .arrow {
         transition: transform 0.2s ease;

         &.--rotate {
            transform: rotate(180deg);
         }
      }

      &.has-error .select-box {
         border-color: red;
      }

      &__options {
         position: absolute;
         top: calc(100% + 4px);
         left: 0;
         right: 0;
         background: white;
         border: 1px solid #ccc;
         border-radius: 6px;
         max-height: 150px;
         overflow-y: auto;
         z-index: 10;
      }

      &__option {
         padding: 8px 16px;
         cursor: pointer;
         text-transform: capitalize;

         &:not(:last-child) {
            border-bottom: 1px solid #ccc;
         }

         &:hover {
            background: #f2f2f2;
         }
      }

      .error {
         color: red;
         font-size: 12px;
         margin-top: 4px;
      }

      .placeholder {
         color: #757575;
      }
   }
</style>