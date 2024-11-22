<script lang="ts">
import { defineComponent } from 'vue'
import { formatDateMMDDYYYY } from '@/utils'
import { TextField } from '@/components'

export default defineComponent({
  name: 'DatePicker',
  components: { TextField },
  props: {
    modelValue: {
      type: Date,
      required: true
    },
    label: {
      type: String,
      default: 'Date'
    }
  },
  emits: ['update:modelValue'],
  data: (): {
    date: Date | null
    show: boolean
  } => ({
    date: null,
    show: false
  }),
  computed: {
    formattedDate: () => formatDateMMDDYYYY,
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(value: Date) {
        this.date = value
      }
    }
  },
  methods: {
    handleDateChange(value: Date | null) {
      this.show = false
      this.date = value
      this.$emit('update:modelValue', value)
    }
  }
})
</script>

<template>
  <v-menu v-model="show" location="end" scrim="true" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <TextField :value="formattedDate(date)" v-bind="props" :label="label"
        prepend-inner-icon="mdi-calendar-month" variant="outlined" messages="MM/DD/YYYY" />
    </template>
    <v-date-picker color="tertiary" v-model="date" theme="light"
    @update:model-value="handleDateChange" />
  </v-menu>
</template>