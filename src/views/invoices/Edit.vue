<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import InvoiceForm from './_Form.vue'


export default defineComponent({
  name: 'Invoices/Edit',
  components: { InvoiceForm },
  data: (): {
    formData: {
      id: number | undefined,
      clientId: number | undefined,
      refNo: string,
      issueDate: Date,
      dueDate: Date,
      lineItems: any[], // TODO: type this
      notes: string
    } | undefined,
    loading: boolean
  } => ({
    formData: undefined,
    loading: true
  }),
  mounted() {
    this.loadInvoice()
  },
  methods: {
    async loadInvoice() {
      try {
        const response = await API.invoices.show(this.$route.params.invoiceId)
        const { id, clientId, refNo, issueDate, dueDate, lineItems, notes } = response.data
        this.formData = {
          id,
          clientId,
          refNo,
          issueDate,
          dueDate,
          lineItems,
          notes
        }
      } catch(e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
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
        console.log('DATA', data)
        await API.invoices.update({ 
          id: this.formData.id, 
          ...data 
        })
        this.$router.push({ name: 'Invoices/Show', params: { invoiceId: data.id }})
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
        <h1 class="title">Editing Invoice</h1>
      </v-col>
    </v-row>
    <InvoiceForm
      :formData="formData"
      :loading="loading"
      @submitForm="submitForm"
    />
  </v-container>
</template>