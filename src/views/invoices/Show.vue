<script lang="ts">
import { defineComponent, provide } from 'vue'
import { _Client, _Invoice, _InvoiceStatus, _LineItem, _Payment, _Tax, _TaxType, _User } from '@jimmyjames88/freebooks-types'
import { formatDateMMDDYYYY } from '@/utils'
import { Avatar, Button, Expenses, Header, InvoiceStatus, InvoiceTotals, Payments, Spinner } from '@/components'
import PaymentDialog from '@/views/payments/_Dialog.vue'
import Invoice from '@/classes/Invoice'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Invoices/Show',
  components: { Avatar, Button, Expenses, Header, InvoiceStatus, InvoiceTotals, PaymentDialog, Payments, Spinner },
  setup() {
    const { 
      amountDue, expensesTotal, Invoice, isSent, loadInvoice, pastDue, paymentsTotal, subtotal, tax, total
    } = InvoiceComposable()

    provide('Invoice', Invoice)
    
    return {
      amountDue, expensesTotal, Invoice, isSent, loadInvoice, pastDue, paymentsTotal, subtotal, tax, total
    }
  },
  data: (): {
    loading: boolean,
    showPaymentDialog: boolean,
    // Invoice: Invoice
  } => ({
    loading: true,
    showPaymentDialog: false,
    // Invoice: {
    //   id: -1,
    //   lineItems: [] as {
    //     type: string,
    //     description: string,
    //     rate: number,
    //     quantity: number
    //   }[],
    //   notes: '',
    //   refNo: '',
    //   issueDate: undefined,
    //   dueDate: undefined,
    //   status: undefined,
    //   Taxes: [],
    //   Payments: [],
    //   Expenses: [],
    //   User: {} as _User,
    //   Client: {} as _Client,
    // }
  }),
  computed: {
    headerTitle(): string {
      if (this.$vuetify.display.mdAndUp) return ''
      let title = 'Invoice'
      title += this.Invoice.refNo ? ` #${this.Invoice.refNo}` : ''
      return title
    }
  },
  async mounted() {
    this.loading = true
    try {
      await this.loadInvoice(Number(this.$route.params.InvoiceId))
    } catch (err) {
      console.error(err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    addPayment(payment: _Payment) {
      console.log('PAYMENT', payment)
      this.Invoice.Payments?.push(payment)
    },
    download() {
      console.log('downloading... todo')
    },
    formatDate(date: Date | null) {
      if (date)
        return formatDateMMDDYYYY(date)
      return ''
    },
    print() {
      window.print()
    }
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <template v-else>
    <Header :title="headerTitle">
      <template #desktop>
        <Button color="primary" @click="showPaymentDialog = true">
          <v-icon>mdi-cash-multiple</v-icon> Add payment
        </Button>
        <Button color="primary" :disabled="!Invoice.Client?.id">
          <v-icon>mdi-email</v-icon> {{ isSent ? 'Send' : 'Resend' }}
        </Button>
        <Button color="primary" :to="{ name: 'Invoices/Edit', params: { InvoiceId: Invoice.id } }">
          <v-icon>mdi-receipt-text-edit</v-icon> Edit
        </Button>
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" color="transparent" icon flat>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="print">
              <v-icon>mdi-printer</v-icon> Print
            </v-list-item>
            <v-list-item @click="download" disabled>
              <v-icon>mdi-download</v-icon> Download
            </v-list-item>
            <v-list-item :to="{ name: 'Invoices/Delete', params: { InvoiceId: id } }">
              <v-icon>mdi-delete</v-icon> Delete
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #mobile>
        <v-list>
          <v-list-item :to="{ name: 'Invoices/Edit', params: { InvoiceId: id } }">
            <v-icon>mdi-receipt-text-edit</v-icon> Edit
          </v-list-item>
          <v-list-item>
            <v-icon>mdi-email</v-icon> {{ isSent ? 'Send' : 'Resend' }}
          </v-list-item>
          <v-list-item @click="print">
            <v-icon>mdi-printer</v-icon> Print
          </v-list-item>
          <v-list-item @click="download" disabled>
            <v-icon>mdi-download</v-icon> Download
          </v-list-item>
          <v-list-item :to="{ name: 'Invoices/Delete', params: { InvoiceId: id } }">
            <v-icon>mdi-delete</v-icon> Delete
          </v-list-item>
        </v-list>
      </template>
    </Header>
    <v-container>
      <div class="document pa-4 pa-sm-8">
        <v-row>
          <v-col>
            <h1 class="title">
              Invoice
              <InvoiceStatus v-if="Invoice.status && Invoice.id"
                v-model="Invoice.status"
                :InvoiceId="Invoice.id"
                :dueDate="Invoice.dueDate || undefined"
                class="d-print-none"
              />
            </h1>
            <h3># {{ Invoice.refNo }}</h3>
          </v-col>
          <v-col align="end">
            <h3 v-if="Invoice.issueDate">Issued: {{ formatDate(Invoice.issueDate) }}</h3>
            <h3 v-if="Invoice.dueDate">Pay by: {{ formatDate(Invoice.dueDate) }}</h3>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12" sm="6">
            <template v-if="Invoice.User?.Profile">
              <h2>{{ Invoice.User.Profile.displayName }}</h2>
              <p v-if="Invoice.User.Profile.address?.line1">{{ Invoice.User.Profile.address.line1 }}</p>
              <p v-if="Invoice.User.Profile.address?.line2">{{ Invoice.User.Profile.address.line2 }}</p>
              <p>
                <span v-if="Invoice.User.Profile.address?.city">{{ Invoice.User.Profile.address.city }}, </span>
                <span v-if="Invoice.User.Profile.address?.state">{{ Invoice.User.Profile.address.state }}, </span>
                <span v-if="Invoice.User.Profile.address?.postal">{{ Invoice.User.Profile.address.postal }}</span>
              </p>
              <p v-if="Invoice.User.Profile.address?.country">{{ Invoice.User.Profile.address.country }}</p>
            </template>
          </v-col><!-- TODO -->
          <v-col cols="12" sm="6">
            <div v-if="Invoice.Client">
              <h2>
                <router-link v-if="Invoice.Client.id" :to="{ name: 'Clients/Show', params: { ClientId: Invoice.Client.id } }">
                  {{ Invoice.Client.name }}
                </router-link>
              </h2>
              <p>{{ Invoice.Client?.address?.line1 }}</p>
              <p>{{ Invoice.Client?.address?.line2 }}</p>
              <p>
                {{ Invoice.Client?.address?.city }},
                {{ Invoice.Client?.address?.state }}
                {{ Invoice.Client?.address?.postal }}
              </p>
              <p>{{ Invoice.Client?.address?.country }}</p>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-8" />
        <v-row class="line-item-headers">
          <v-col cols="12" sm="6">
            <h3>Description</h3>
          </v-col>
          <v-col cols="4" sm="2" align="center">
            <h3>Rate</h3>
          </v-col>
          <v-col cols="4" sm="2" align="center">
            <h3>Quantity</h3>
          </v-col>
          <v-col cols="4" sm="2" align="end">
            <h3>Total</h3>
          </v-col>
        </v-row>

        <v-row v-for="(item, index) in Invoice.lineItems" :key="`item-${index}`" class="line-item">
          <v-col cols="12" sm="6">{{ item.description }}</v-col>
          <v-col cols="4" sm="2" align="center">${{ item.rate }}</v-col>
          <v-col cols="4" sm="2" align="center">{{ item.quantity }}</v-col>
          <v-col cols="4" sm="2" align="end">${{ ((item.quantity || 1) * (item.rate || 0)).toFixed(2) }}</v-col>
        </v-row>

        <template v-if="Invoice.Expenses?.length">
          <v-divider class="mt-8 mb-4" />
          <Expenses :expenses="Invoice.Expenses" />
        </template> 
  
        <template v-if="Invoice.Payments?.length">
          <v-divider class="mt-8 mb-4" />
          <Payments />
        </template>

        <v-divider class="mt-16 mb-8" thickness="10" />
        <v-row>
          <v-col>
            {{ Invoice.notes }}
          </v-col>
          <v-col md="4">
            <InvoiceTotals />
          </v-col>
        </v-row>
      </div>
    </v-container>
    <PaymentDialog  v-if="showPaymentDialog"
      :InvoiceId="Invoice.id"
      :ClientId="Invoice.Client?.id"
      @saved="addPayment"
      @close="showPaymentDialog = false"
    />
  </template>
</template>