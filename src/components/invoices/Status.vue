<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _Invoice, _InvoiceStatus } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { Button } from '@/components'
import PastDue from './PastDue.vue'
import { Invoice } from '@/classes'

export default defineComponent({
  name: 'Invoices.Status',
  inheritAttrs: false,
  components: { Button, PastDue },
  props: {
    dueDate: {
      type: Date,
      default: null
    },
    InvoiceId: {
      type: Number,
      required: true
    },
    modelValue: {
      type: String as PropType<_InvoiceStatus>,
      required: true
    },
    smallPD: {
      type: Boolean,
      default: false
    }
  },
  data: (): {
    showConfirmDialog: boolean
    newStatus?: _InvoiceStatus
  } => ({
    showConfirmDialog: false,
    newStatus: undefined
  }),
  computed: {
    color(): string {
      switch (this.modelValue) {
        case _InvoiceStatus.DRAFT:
          return 'light'
        case _InvoiceStatus.SENT:
          return 'success'
        case _InvoiceStatus.PARTIAL:
          return 'indigo'
        case _InvoiceStatus.PAID:
          return 'success'
        case _InvoiceStatus.VOID:
          return 'color-6'
        default:
          return 'secondary'
      }
    },
    statuses(): _InvoiceStatus[] {
      return Object.values(_InvoiceStatus)
    }
  },
  methods: {
    confirm(status: _InvoiceStatus) { // todo type
      this.newStatus = status
      this.showConfirmDialog = true
    },
    async save() {
      try {
        await new Invoice({ id: this.InvoiceId }).updateStatus(this.newStatus)
        this.$emit('update:model-value', this.newStatus)
      } catch (error) {
        console.error(error)
      } finally {
        this.showConfirmDialog = false
      }
    }
  }
})
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <div class="d-inline-flex align-center">
        <v-chip v-bind="{ ...$attrs, ...props }" :color="color" size="small">
          {{ modelValue }}
          <v-icon>mdi-menu-down</v-icon>
        </v-chip>
        <PastDue :dueDate="dueDate" :status="modelValue" :small="smallPD" />
      </div>
    </template>
    <v-list>
      <v-list-subheader>Change Invoice status</v-list-subheader>
      <v-list-item v-for="status in statuses" 
        :key="status"
        @click="confirm(status)"
      >
        <v-list-item-title class="text-capitalize">{{ status }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-dialog v-model="showConfirmDialog" width="500">
    <v-card>
      <v-card-title>Confirm</v-card-title>
      <v-card-text>
        Are you sure you want to change the status to {{ newStatus }}?
      </v-card-text>
      <v-card-actions align="end">
        <Button @click="showConfirmDialog = false">Cancel</Button>
        <Button color="primary" @click="save">Confirm</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.v-chip {
  text-transform: uppercase;
}

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