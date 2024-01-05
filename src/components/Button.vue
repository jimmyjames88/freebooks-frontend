<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  inheritAttrs: false
})
</script>

<template>
  <v-btn v-bind="$attrs" flat>
    <slot />
  </v-btn>
</template>

<style lang="scss" scoped>
.v-btn {
  border-radius: 0;
  box-shadow: none;
  font-size: 1.125rem;
  font-family: 'Fira Sans';
  font-style: italic;
  font-weight: 900;
  text-transform: initial;
  letter-spacing: normal;

  &.bg-transparent {
    color: rgba(var(--v-theme-primary)) !important;

    &.v-btn--disabled {
      opacity: 0.3;

      :deep(.v-btn__overlay) {
        opacity: 0 !important;
      }
    }
  }
}
</style>