<script lang="ts">
import { defineComponent } from 'vue'
import Payment from '@/classes/Payment'
import InvoiceComposable from '@/composables/Invoice'
import { ConfirmDeleteDialog } from '@/components'

export default defineComponent({
  name: 'Payments.Payments',
  components: { ConfirmDeleteDialog },
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
    handleDelete(payment: Payment) {
      this.Invoice.Payments?.splice(this.Invoice.Payments?.indexOf(payment), 1)
      this.showConfirmDelete = -1
    }
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
      <v-col v-if="deleteable"></v-col>
    </v-row>
    <v-row v-for="(payment, index) in Invoice.Payments" :key="`payment-${index}`" class="line-item">
      <v-col>{{ payment.date }}</v-col>
      <v-col>{{ payment.description }}</v-col>
      <!-- <v-col>{{ payment.PaymentType?.name }}</v-col> -->
      <v-col>{{ payment.paymentTypeId }}</v-col>
      <v-col align="end">${{ payment.amount }}</v-col>
      <template v-if="deleteable">
        <v-col align="end">
          <v-btn icon="mdi-close" color="primary" size="x-small" @click="showConfirmDelete = index" variant="flat" tabindex="-1"></v-btn>
        </v-col>
        <ConfirmDeleteDialog v-if="showConfirmDelete === index" @close="showConfirmDelete = -1" @confirm="handleDelete(payment)" />
      </template>
    </v-row>
  </div>
</template>