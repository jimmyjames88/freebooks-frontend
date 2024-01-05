<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification';
import { _Invoice } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import InvoiceForm from './_Form.vue'


export default defineComponent({
  name: 'Invoices/Create',
  components: { InvoiceForm },

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
  <v-container>
    <v-row>
      <v-col>
        <h1 class="title">New Invoice</h1>
      </v-col>
    </v-row>
    <InvoiceForm @submitForm="submitForm" />
  </v-container>
</template>