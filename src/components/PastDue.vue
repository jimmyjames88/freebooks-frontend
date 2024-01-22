<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'

export default defineComponent({
  name: 'PastDue',
  inheritAttrs: false,
  props: {
    dueDate: {
      type: Date,
    },
    small: {
      type: Boolean,
      default: false
    },
    status: {
      type: String as PropType<_InvoiceStatus>,
      required: true
    }
  },
  computed: {
    isPastDue(): boolean {
      return (
        !!this.dueDate
        && new Date(this.dueDate) < new Date()
        && this.status !== _InvoiceStatus.PAID
        && this.status !== _InvoiceStatus.VOID
      )
    },
  }
})
</script>

<template>
  <div v-if="isPastDue" class="d-inline-flex">
    <v-tooltip v-if="small">
      <template #activator="{ props }">
        <v-icon v-bind="props" class="ml-1" color="primary">mdi-alert-circle</v-icon>
      </template>
      Past due
    </v-tooltip>
    <v-chip v-else class="ml-1" color="primary" size="small">
      PAST DUE <v-icon class="ml-1">mdi-alert-circle</v-icon>
    </v-chip>
  </div>
</template>