<script lang="ts">
import { defineComponent } from 'vue'
import Invoice from '@/classes/Invoice'
import { _Payment } from '@jimmyjames88/freebooks-types'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Payments',
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  }
})
</script>

<template>
  <div>
    <h2>Payments</h2>
    <v-row>
      <v-col>
        <h3>Date</h3>
      </v-col>
      <v-col>
        <h3>Description</h3>
      </v-col>
      <v-col>
        <h3>Type</h3>
      </v-col>
      <v-col align="end">
        <h3>Amount</h3>
      </v-col>
    </v-row>
    <v-row v-for="(payment, index) in Invoice.Payments" :key="`payment-${index}`" class="line-item">
      <v-col>{{ payment.date }}</v-col>
      <v-col>{{ payment.description }}</v-col>
      <v-col>{{ payment.PaymentType?.name }}</v-col>
      <v-col align="end">${{ payment.amount }}</v-col>
    </v-row>
  </div>
</template>