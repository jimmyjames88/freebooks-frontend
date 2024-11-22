<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { _LineItem, _Payment, _Tax } from '@jimmyjames88/freebooks-types'
import InvoiceForm from './_Form.vue'
import { Header, Spinner } from '@/components'
import InvoiceComposable from '@/composables/Invoice'


export default defineComponent({
  name: 'Invoices/Edit',
  components: { Header, InvoiceForm, Spinner },
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  },
  data: (): {
    loading: boolean
  } => ({
    loading: true
  }),
  async mounted() {
    try {
      await this.Invoice.get(Number(this.$route.params.InvoiceId))
    } catch(err) {
      console.error(err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async submitForm() {
      try {
        this.loading = true
        await this.Invoice.save()   
        useToast().success('Invoice saved')
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
  <Spinner v-if="loading" />
  <div v-else>
    <Header title="Edit Invoice" />
    <v-container>
      <InvoiceForm
        v-if="Invoice"
        :loading="loading"
        editing
        @submitForm="submitForm"
      />
    </v-container>
  </div>
</template>