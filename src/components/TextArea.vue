<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TextArea',
  inheritAttrs: false,
  props: {
    label: {
      type: String
    },
    class: {
      type: String
    }
  }
})
</script>

<template>
  <div :class="class" class="text-field">
    <label v-if="label">{{ label }}</label>
    <v-textarea v-bind="$attrs" />
  </div>
</template>

<style lang="scss" scoped>
.text-area {  
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
    border-radius: 0;
  }
}
</style>