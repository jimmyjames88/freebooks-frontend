<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import { Button, InvoiceCard } from '@/components'

export default defineComponent({
  name: 'Invoices/Index',
  components: { Button, InvoiceCard },
  data: () => ({
    loading: true,
    invoices: [] as { id: string, total: string }[],
  }),
  async mounted() {
    API.invoices.index().then((response: AxiosResponse) => {
      this.invoices = response.data
    }).catch((err: AxiosError) => {
      console.warn(err)
    }).finally(() => {
      this.loading = false
    })
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
      <v-col v-for="invoice in invoices" :key="`invoice-${invoice.id}`" cols="12" sm="6" md="4" lg="3">
        <InvoiceCard v-bind="invoice" :loading="loading" />
      </v-col>
    </v-row>
  </v-container>
</template>