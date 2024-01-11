<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Avatar',
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: false
    },
    jumbo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    letters(): string {
      return this.name ? this.initials(this.name) : '?'
    }
  },
  methods: {
    initials: (str: string) => {
      const words = str?.split(' ')
      const initials = words?.map(word => word.substring(0,1)) as string[]
      const first = initials[0]

      if (initials.length > 1) {
        const last = initials[initials.length -1]
        return `${first}${last}`.toUpperCase()
      }
      return first.toUpperCase()
    },

    stringToColor: (str: string) => {
      let words: string[] = str.split(' ')
      const count = words.reduce((acc, word) => {
        if (isNaN(word.charCodeAt(1))) {
          return acc + 1
        }
        return acc + word.charCodeAt(1) // middle letter
      }, 0)

      // Reduce count to common denominator between 1 and 15
      const color = count % 15 || 15
      return `color-${color}`
    }
  }
})
</script>

<template>
  <v-avatar v-bind="$attrs" :class="[stringToColor(letters), { jumbo }]">
    <span class="text-h6">
      {{ letters }}
    </span>
  </v-avatar> 
</template>

<style lang="scss" scoped>
.v-avatar {
  width: 40px;
  height: 40px;
  color: #ffffff;
  opacity: 0.75;

  .text-h6 {
    font-family: 'Fira Sans' !important;
    text-transform: uppercase !important;
    font-size: 1.125rem !important;
  }

  &.jumbo {
    width: 96px;
    height: 96px;

    .text-h6 {
      font-size: 2.75rem !important;
    }
  }

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