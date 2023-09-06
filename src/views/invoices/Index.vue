<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import { Button, InvoiceCard } from '@/components'

export default defineComponent({
  name: 'Invoices/Index',
  components: { Button, InvoiceCard },
  data: () => ({
    invoices: [] as { _id: string, total: string }[],
  }),
  async mounted() {
    const response = await API.invoices.index()
    if (response.status === 200)
      this.invoices = response.data
  }
})
</script>

<template>
  <v-container>
    <v-row justify="start" align="center">
      <v-col>
        <h1 class="title">Invoices</h1>
      </v-col>
      <v-col align="end">
        <Button color="transparent" disabled>
          <v-icon>mdi-magnify</v-icon> Search
        </Button>
        <Button :to="{ name: 'Invoices/Create' }" color="primary">
          <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
        </Button>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="invoice in invoices" :key="`invoice-${invoice._id}`" cols="12" sm="6" md="4" lg="3">
        <InvoiceCard v-bind="invoice" />
      </v-col>
    </v-row>
  </v-container>
</template>