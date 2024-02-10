<script lang="ts">
import { defineComponent } from 'vue'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Invoices.Totals',
  setup() {
    const { amountDue, expensesTotal, Invoice, paymentsTotal, subtotal, tax, total } = InvoiceComposable()
    return { amountDue, expensesTotal, Invoice, paymentsTotal, subtotal, tax, total }
  }
})
</script>

<template>
  <v-row>
    <v-col>Subtotal</v-col>
    <v-col align="end">${{ subtotal.toFixed(2) }}</v-col>
  </v-row>
  <v-row v-for="tax in Invoice.Taxes">
    <v-col cols="6">
      {{ tax.name }}
      <span v-if="tax.type === 'PERCENTAGE'">({{ tax.rate * 100 }}%)</span>
    </v-col>
    <v-col cols="6" align="end">
      {{ tax.type === 'PERCENTAGE' ? '$' + (subtotal * tax.rate).toFixed(2) : '$' +
        tax.rate.toFixed(2) }}
    </v-col>
  </v-row>
  <template v-if="Invoice.Payments?.length">
    <v-divider class="mt-4 mb-2" />
    <v-row>
      <v-col>
        <h4>Total</h4>
      </v-col>
      <v-col align="end">
        <h4>${{ total }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Expenses (tax inc)</v-col>
      <v-col align="end">
        ${{ expensesTotal.toFixed(2) }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Less amount paid
      </v-col>
      <v-col align="end">
        <h4 class="text-secondary">(${{ paymentsTotal.toFixed(2) }})</h4>
      </v-col>
    </v-row>
  </template>
  <v-divider class="mt-4 mb-2" />
  <v-row>
    <v-col>
      <h2>Amount due</h2>
    </v-col>
    <v-col align="end">
      <h2 class="text-tertiary">${{ amountDue.toFixed(2) }}</h2>
    </v-col>
  </v-row>
</template>