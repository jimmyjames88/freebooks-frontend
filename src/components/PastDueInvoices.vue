<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import { _Invoice } from '@jimmyjames88/freebooks-types'
import InvoiceCards from './InvoiceCards.vue'
import Spinner from './Spinner.vue'
import API from '@/api'

export default defineComponent({
  name: 'PastDueInvoices',
  components: { InvoiceCards, Spinner },
  data: (): {
    loading: boolean,
    pastDueInvoices: _Invoice[],
    pastDueInvoicesCount: number
  } => ({
    loading: true,
    pastDueInvoices: [],
    pastDueInvoicesCount: 0
  }),
  mounted() {
    this.loadPastDueInvoices()
  },
  methods: {
    async loadPastDueInvoices() {
      try {
        const response = await API.invoices.index({
          itemsPerPage: 3,
          filters: {
            custom: {
              pastDue: true
            }
          }
        })
        this.pastDueInvoices = response.data.items.map((invoice: _Invoice) => {
          invoice.issueDate = new Date(invoice.issueDate)
          invoice.dueDate = new Date(invoice.dueDate)
          return invoice
        })
        this.pastDueInvoicesCount = response.data.total
      } catch (err) {
        console.warn(err)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<template>
  <h2>Past due invoices</h2>
  <Spinner v-if="loading" />
  <InvoiceCards v-else
    :invoices="pastDueInvoices"
    :showMoreText="`View all (${pastDueInvoicesCount})`"
    showMoreTo="#"
  />
</template>