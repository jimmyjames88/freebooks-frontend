<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification';
import { _Invoice, _LineItem } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import InvoiceForm from './_Form.vue'
import { Header, Spinner } from '@/components'


export default defineComponent({
  name: 'Invoices/Edit',
  components: { Header, InvoiceForm, Spinner },
  data: (): {
    formData: {
      id: number | undefined,
      clientId: number | undefined,
      refNo: string,
      issueDate: Date,
      dueDate: Date,
      lineItems: _LineItem[],
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
    async submitForm(data: Partial<_Invoice>) {
      try {
        this.loading = true
        await API.invoices.update({ 
          id: this.formData?.id,
          ...data 
        })
        useToast().success('Invoice saved')
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
  <Spinner v-if="loading" />
  <div v-show="!loading">
    <Header title="Edit Invoice" />
    <v-container>
      <InvoiceForm
        :formData="formData"
        :loading="loading"
        @submitForm="submitForm"
      />
    </v-container>
  </div>
</template>