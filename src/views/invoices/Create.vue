<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification';
import { _Invoice } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { Header } from '@/components'
import InvoiceComposable from '@/composables/Invoice'
import InvoiceForm from './_Form.vue'

export default defineComponent({
  name: 'Invoices/Create',
  components: { Header, InvoiceForm },
  setup() {
    const { resetInvoice, Invoice } = InvoiceComposable()
    return { resetInvoice, Invoice }
  },
  beforeCreate() {
    this.resetInvoice()
  },
  methods: {
    async submitForm() {
      try {
        const invoice = await API.invoices.store(this.Invoice)
        const { id } = invoice
        useToast().success('Invoice created')
        this.$router.push({ name: 'Invoices/Show', params: { InvoiceId: id }})
      } catch(e) {
        console.error(e)
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