<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { InvoiceCards, OutstandingRevenue } from '@/components'

export default defineComponent({
  name: 'Dashboard',
  components: { InvoiceCards, OutstandingRevenue },
  data: (): {
    pastDueInvoices: _Invoice[],
    pastDueInvoicesCount: number
  } => ({
    pastDueInvoices: [],
    pastDueInvoicesCount: 0
  }),
  mounted() {
    this.loadPastDueInvoices()
  },
  methods: {
    loadPastDueInvoices() {
      const today = new Date()
      API.invoices.index({
        itemsPerPage: 3,
        filters: {
          custom: {
            pastDue: true
          }
        }
      }).then((response) => {
        this.pastDueInvoices = response.data.items
        this.pastDueInvoicesCount = response.data.total
      })
    }
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Dashboard</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>Outstanding revenue</h2>
        <OutstandingRevenue />
      </v-col>
    </v-row>
    <v-divider class="my-8" />
    <v-row>
      <v-col>
        <h2>Past due invoices</h2>
        <InvoiceCards :invoices="pastDueInvoices" :showMoreText="`View all (${pastDueInvoicesCount})`" showMoreTo="#" />
      </v-col>
    </v-row>
  </v-container>
</template>