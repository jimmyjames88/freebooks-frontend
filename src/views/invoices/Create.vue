<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification';
import { _Invoice } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import InvoiceForm from './_Form.vue'
import { Header } from '@/components'


export default defineComponent({
  name: 'Invoices/Create',
  components: { Header, InvoiceForm },

  methods: {
    async submitForm(data: Partial<_Invoice>) {
      try {
        const response = await API.invoices.store({ ...data })
        const { id } = response.data
        useToast().success('Invoice created')
        this.$router.push({ name: 'Invoices/Show', params: { invoiceId: id }})
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