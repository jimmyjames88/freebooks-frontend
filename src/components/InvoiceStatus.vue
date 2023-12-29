<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InvoiceStatus',
  inheritAttrs: false,
  props: {
    status: String,
  },
  computed: {
    color() {
      switch (this.status) {
        case 'DRAFT':
          return 'light'
        case 'SENT':
          return 'success'
        case 'PARTIAL':
          return 'indigo'
        case 'PAID':
          return 'success'
        case 'PASTDUE':
          return 'warning'
        case 'VOID':
          return 'color-6'
        default:
          return 'secondary'
      }
    }
  }
})
</script>

<template>
  <v-chip :color="color" size="small" v-bind="$attrs">{{ status }}</v-chip>
</template>

<style lang="scss" scoped>
.v-avatar {
  width: 40px;
  height: 40px;
  color: #ffffff;
  opacity: 0.75;

  &.color {
    &-1 { background-color: #f44336; }
    &-2 { background-color: #e91e63; }
    &-3 { background-color: #9c27b0; }
    &-4 { background-color: #673ab7; }
    &-5 { background-color: #3f51b5; }
    &-6 { background-color: #2196f3; }
    &-7 { background-color: #03a9f4; }
    &-8 { background-color: #00bcd4; }
    &-9 { background-color: #009688; }
    &-10 { background-color: #4caf50; }
    &-11 { background-color: #8bc34a; }
    &-12 { background-color: #cddc39; }
    &-13 { background-color: #ffeb3b; }
    &-14 { background-color: #ffc107; }
    &-15 { background-color: #ff9800; }
  }
}

</style>