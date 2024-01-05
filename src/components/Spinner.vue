<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Spinner',
  inheritAttrs: false
})
</script>

<template>
  <div class="d-flex justify-center align-center h-100">
    <v-progress-circular indeterminate v-bind="$attrs" size="x-large" />
  </div>
</template>