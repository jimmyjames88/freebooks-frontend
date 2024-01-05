<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AutoComplete',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Number
    },
    label: {
      type: String
    },
    class: {
      type: String
    }
  },
  computed: {
    value: {
      get(): number | undefined {
        return this.modelValue
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
</script>

<template>
  <div class="text-field">
    <label v-if="label">{{ label }}</label>
    <v-autocomplete v-bind="$attrs" v-model="value" />
  </div>
</template>

<style lang="scss" scoped>
.text-field {  
  label {
    font-size: 1.125rem;
  }

  :deep(.v-field) .v-field__outline {
    border-radius: 0;
  }
  
  :deep(.v-field:not(.v-field--variant-underlined, .v-field--variant-outlined) .v-field__outline) {
    display: none !important;
  }
  :deep(.v-field--variant-filled .v-field__overlay) {
    opacity: 1;
    background-color: white;
    border-radius: 0;
  }

  :deep(.v-field__input) {
    color: #9A8F99; 
    font-weight: 600;
    border-radius: 0;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type=number] {
      -moz-appearance: textfield;
    }
  }

}
</style>