<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import InvoiceForm from './_Form.vue'


export default defineComponent({
  name: 'Invoices/Create',
  components: { InvoiceForm },
  data: () => ({
    loading: false
  }),

  methods: {
    async submitForm(data: {
      clientId: number | undefined, 
      refNo: string,
      issueDate: Date,
      dueDate: Date,
      lineItems: any[], 
      notes: string
    }) {
      try {
        this.loading = true
        const response = await API.invoices.store({ ...data })
        const { id } = response.data        
        this.$router.push({ name: 'Invoices/Show', params: { invoiceId: id }})
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
  <v-container>
    <v-row>
      <v-col>
        <h1 class="title">New Invoice</h1>
      </v-col>
    </v-row>
    <InvoiceForm
      :loading="loading"
      @submitForm="submitForm"
    />
  </v-container>
</template>