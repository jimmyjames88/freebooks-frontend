<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification';
import API from '@/api'
import { Header } from '@/components'
import InvoiceComposable from '@/composables/Invoice'
import InvoiceForm from './_Form.vue'

export default defineComponent({
  name: 'Invoices/Create',
  components: { Header, InvoiceForm },
  setup() {
    const { clearInvoice, Invoice } = InvoiceComposable()
    clearInvoice()
    return { clearInvoice, Invoice }
  },
  data: (): {
    loading: boolean
  } => ({
    loading: true
  }),
  mounted() {
    this.loading = false
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true
        const invoice = await API.invoices.store(this.Invoice)
        useToast().success('Invoice created')
        this.$router.push({ name: 'Invoices/Show', params: { InvoiceId: invoice.id }})
      } catch(e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<template>
  <Header title="New Invoice" />
  <v-container>
    <InvoiceForm @submitForm="submitForm" />
  </v-container>
</template>