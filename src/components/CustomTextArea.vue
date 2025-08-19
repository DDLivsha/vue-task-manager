<script setup lang="ts">
   import { ref, watch, computed } from 'vue'

   interface Props {
      modelValue: string | number
      type?: string
      placeholder?: string
      error?: string | null
   }

   const props = withDefaults(defineProps<Props>(), {
      type: 'text',
      placeholder: '',
      error: null,
   })

   const emit = defineEmits<{
      (e: 'update:modelValue', value: string | number): void
      (e: 'blur'): void
      (e: 'focus'): void
   }>()

   const internalValue = ref(props.modelValue)

   watch(() => props.modelValue, (val) => {
      internalValue.value = val
   })

   const inputClasses = computed(() => [
      'base-input',
      props.error ? 'base-input--error' : ''
   ])
</script>

<template>
   <div class="base-input__wrapper">
      <textarea
         :placeholder="props.placeholder"
         v-model="internalValue"
         :class="inputClasses"
         @input="emit('update:modelValue', internalValue)"
         @blur="emit('blur')"
         @focus="emit('focus')"
      />
      <p
         v-if="props.error"
         class="base-input__error"
      >{{ props.error }}</p>
   </div>
</template>

<style scoped lang="scss">
   .base-input__wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
   }

   .base-input {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 16px;
      outline: none;

      &:hover,
      &:focus {
         border-color: #666;
      }

      &--error {
         border-color: red;
      }
   }

   .base-input__error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
   }
</style>