<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Checkbox',
  inheritAttrs: false,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return {
      props,
      emit
    }
  }
})
</script>

<template>
  <v-checkbox v-bind="$attrs"
    hide-details
    false-icon="mdi-checkbox-blank"
    true-icon="mdi-checkbox-marked"
  /> 
</template>

<style lang="scss" scope>
.v-label {
  opacity: 1 !important;
}
</style>