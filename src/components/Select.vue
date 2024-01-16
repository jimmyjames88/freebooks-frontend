<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Select',
  inheritAttrs: false,
  props: {
    label: String
  }
})
</script>

<template>
  <div class="select">
    <label v-if="label">{{ label }}</label>
    <v-select v-bind="$attrs" variant="solo" flat>
      <slot />
    </v-select>
  </div>
</template>

<style lang="scss" scoped>
.select label {
  font-size: 1.125rem;
}
.v-select {
  box-shadow: none;
  font-size: 1.125rem;
  font-family: 'Fira Sans';
  font-style: italic;
  font-weight: 900;
  text-transform: initial;
  letter-spacing: normal;

  :deep(.v-field) {
      border-radius: 0 !important;
  }
}
</style>