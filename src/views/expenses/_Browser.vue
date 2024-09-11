<script lang="ts">
import { defineComponent } from 'vue'
import { _Collection, _Invoice, _PaymentType } from '@jimmyjames88/freebooks-types'
import { Button, ClientSelect, DataTable, InvoiceSelect, PaymentTypeSelect, Select, TextField } from '@/components'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import { Expense } from '@/classes'
import InvoiceComposable from '@/composables/Invoice'
import DataTableComposable from '@/composables/DataTable'


export default defineComponent({
  name: 'Expenses/_Browser',
  inheritAttrs: false,
  components: { Button, ClientSelect, DataTable, InvoiceSelect, PaymentTypeSelect, Select, TextField },
  emits: ['close'],
  setup() {
    const { Invoice } = InvoiceComposable()
    const { items, itemsLength, sortBy, loadItems, loading } = DataTableComposable(API.expenses.index)
    return { Invoice, items, itemsLength, sortBy, loadItems, loading }
  },
  data: (): {
    expenses: Expense[]
    headers: any[]
  } => ({
    expenses: [],
    headers: [{
      title: 'Date',
      align: 'start',
      sortable: true,
      key: 'date'
    },
    {
      title: 'Description',
      sortable: false,
      key: 'description'
    },
    {
      title: 'Subtotal',
      sortable: true,
      key: 'subtotal'
    }]
  }),

  computed: {
    formattedDate: () => formatDateMMDDYYYY,
  },
  methods: {
    attach(_e: MouseEvent, row: any) {
      if (!this.Invoice.Expenses?.find(expense => expense.id === row.item.id)) {
        this.Invoice.Expenses?.push(new Expense({ 
          ...row.item,
          InvoiceId: this.Invoice.id
        }));
      }
      this.close()
    },
    close() {
      this.$emit('close')
    }
  }
})
</script>

<template>
  <v-dialog :model-value="true" v-bind="$attrs" persistent width="1100">
    <v-card>
      <!-- <v-card-text>
        <v-list>
          <v-list-item v-for="expense in expenses">{{ expense.description }} - {{expense.subtotal }}</v-list-item>
        </v-list>
      </v-card-text> -->
      <DataTable
        class="pa-4"
        :headers="headers"
        :sort-by="sortBy"
        :items="items"
        :items-length="itemsLength"
        @load-items="loadItems({ unattached: true })"
        :loading="loading"
        @click:row="attach"
      >
        <template #item.date="{ item }">
          {{ formattedDate(item.date) }}
        </template>
        <template #item.subtotal="{ item }">
          ${{ item.subtotal.toFixed(2) }}
        </template>  
      </DataTable>
      <v-card-actions>
        <v-spacer />
        <Button @click="close">Cancel</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>