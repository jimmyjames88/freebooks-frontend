<script lang="ts">
import { defineComponent } from 'vue'
import InvoiceComposable from '@/composables/Invoice'
import { formatCurrency } from '@/utils';

export default defineComponent({
  name: 'Invoices.Totals',
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  },
  computed: {
    formatCurrency: () => formatCurrency,
    subtotal() {
      return this.Invoice.subtotal()
    }
  }
})
</script>

<template>
  <v-row>
    <v-col>Subtotal</v-col>
    <v-col align="end">{{ formatCurrency(subtotal) }}</v-col>
  </v-row>
  <v-row v-for="tax in Invoice.Taxes">
    <v-col cols="6">
      {{ tax.name }}
    </v-col>
    <v-col cols="6" align="end">
      {{ tax.type === 'PERCENTAGE' ? formatCurrency(subtotal * tax.rate) : formatCurrency(tax.rate) }}
    </v-col>
  </v-row>
  <template v-if="Invoice.Payments?.length">
    <v-divider class="mt-4 mb-2" />
    <v-row>
      <v-col>
        <h4>Total</h4>
      </v-col>
      <v-col align="end">
        <h4>{{ formatCurrency(subtotal) }}</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Expenses (tax inc)</v-col>
      <v-col align="end">
        {{ formatCurrency(Invoice.expensesTotal()) }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Less amount paid
      </v-col>
      <v-col align="end">
        <h4 class="text-secondary">({{ formatCurrency(Invoice.paymentsTotal()) }})</h4>
      </v-col>
    </v-row>
  </template>
  <v-divider class="mt-4 mb-2" />
  <v-row>
    <v-col>
      <h2>Amount due</h2>
    </v-col>
    <v-col align="end">
      <h2 class="text-tertiary">{{ formatCurrency(Invoice.grandTotal()) }}</h2>
    </v-col>
  </v-row>
</template>