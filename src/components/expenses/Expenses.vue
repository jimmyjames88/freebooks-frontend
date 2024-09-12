<script lang="ts">
import { defineComponent } from 'vue'
import { _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import { Expense } from '@/classes'
import { Button, ConfirmDeleteDialog } from '@/components'
import InvoiceComposable from '@/composables/Invoice'


export default defineComponent({
  name: 'Expenses',
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  },
  props: {
    deleteable: {
      type: Boolean,
      default: false
    },
  },
  data: (): {
    showConfirmDelete: number
  } => ({
    showConfirmDelete: -1
  }),
  methods: {
    handleDelete(expense: Expense) {
      this.Invoice.Expenses?.splice(this.Invoice.Expenses?.indexOf(expense), 1)
      this.showConfirmDelete = -1
    },
    taxTotal(amount: number, taxes?: _Tax[]): number {
      return taxes?.reduce((acc, tax) => {
        if (tax.type === _TaxType.PERCENTAGE) {
          return acc + (amount * tax.rate);
        }
        else {
          return acc + tax.rate;
        }
      }, 0) || 0
    }
  },
  components: { Button, ConfirmDeleteDialog }
})
</script>

<template>
  <div>
    <div class="d-flex mb-8">
      <h2>Expenses</h2>
    </div>
    <v-row>
      <v-col>
        <h3>Date</h3>
      </v-col>
      <v-col>
        <h3>Description</h3>
      </v-col>
      <v-col>
        <h3>Amount</h3>
      </v-col>
      <v-col>
        <h3>Tax</h3>
      </v-col>
      <v-col align="end">
        <h3>Total</h3>
      </v-col>
      <v-col v-if="deleteable"></v-col>
    </v-row>
    <v-row v-for="(expense, index) in Invoice.Expenses" :key="`expense-${index}`" class="line-item">
      <v-col>{{ expense.date }}</v-col>
      <v-col>{{ expense.description }}</v-col>
      <v-col>${{ expense.subtotal.toFixed(2) }}</v-col>
      <v-col>${{ taxTotal(expense.subtotal, expense.Taxes).toFixed(2) }}</v-col>
      <v-col align="end">
        ${{ Number(taxTotal(expense.subtotal, expense.Taxes) + expense.subtotal).toFixed(2) }}
      </v-col><!-- todo: optimize pattern, don't like calling taxTotal twice per line -->
      <template v-if="deleteable">
        <v-col align="end">
          <v-btn icon="mdi-close" color="primary" size="x-small" @click="showConfirmDelete = index" variant="flat" tabindex="-1"></v-btn>
        </v-col>
        <ConfirmDeleteDialog v-if="showConfirmDelete === index" @close="showConfirmDelete = -1" @confirm="handleDelete(expense)" />
      </template>
    </v-row>
  </div>
</template>