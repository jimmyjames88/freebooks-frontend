<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification';
import { Header } from '@/components'
import InvoiceComposable from '@/composables/Invoice'
import InvoiceForm from './_Form.vue'

export default defineComponent({
  name: 'Invoices/Create',
  components: { Header, InvoiceForm },
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
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
        await this.Invoice.save()
        useToast().success('Invoice created')
        this.$router.push({ name: 'Invoices/Show', params: { InvoiceId: this.Invoice.id }})
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