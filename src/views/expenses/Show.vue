<script lang="ts">
import { defineComponent } from 'vue'
import { _InvoiceStatus, _TaxType } from '@jimmyjames88/freebooks-types'
import { Button, ConfirmDeleteDialog, Header, InvoiceCard, Spinner } from '@/components'
import { Expense, Invoice, Tax } from '@/classes'
import { formatDateMMDDYYYY, formatCurrency } from '@/utils'
import InvoiceBrowser from '@/views/invoices/_Browser.vue'
import ReceiptUploader from '@/components/expenses/ReceiptUploader.vue'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'Expenses/Show',
  components: { Button, ConfirmDeleteDialog, Header, InvoiceBrowser, InvoiceCard, ReceiptUploader, Spinner },
  data: (): {
    loading: boolean
    expense: Expense
    showConfirmDetatch: boolean
    showInvoiceBrowser: boolean
  } => ({
    loading: true,
    expense: new Expense(),
    showConfirmDetatch: false,
    showInvoiceBrowser: false
  }),

  async mounted() {
    this.loading = true
    const id = Number(this.$route.params.ExpenseId)
    await this.expense.get(id)
    this.loading = false
  },

  computed: {
    formattedDate: () => formatDateMMDDYYYY,
    formatCurrency: () => formatCurrency,
    displayTotal() {
      console.log('DISPLAYTOTAL')
      return formatCurrency(this.expense.total())
    }
  },

  methods: {
    print() {
      window.print()
    },
    async handleAttach(invoice: Invoice) {
      this.expense.Invoice = invoice
      this.expense.InvoiceId = invoice.id
      try {
        await this.expense.save()
        useToast().success('Expense attached to invoice')
      } catch (err) {
        console.error(err)
        useToast().error('Error attaching expense to invoice')
      }
      this.showInvoiceBrowser = false
    },
    async handleDetatch() {
      this.expense.Invoice = new Invoice()
      this.expense.InvoiceId = null
      try {
        await this.expense.save()
        useToast().success('Expense detatched from invoice')
      } catch (err) {
        console.error(err)
        useToast().error('Error detatching expense from invoice')
      }
      this.showConfirmDetatch = false
    },
    handleUpdateStatus(status: _InvoiceStatus) {
      this.expense.Invoice.status = status
    },
    taxLabel(tax: Tax) {
      const amount = tax.type === _TaxType.PERCENTAGE
        ? tax.rate * this.expense.subtotal
        : tax.rate
      
        return `${tax.name} (${formatCurrency(amount)})`
    }
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <template v-else>
    <Header title="Expense details">
      <template #desktop>
        <Button color="primary" :to="{ name: 'Expenses/Edit', params: { ExpenseId: expense.id } }">
          <v-icon>mdi-pencil</v-icon> Edit
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
            <v-list-item :to="{ name: 'Expenses/Delete', params: { ExpenseId: expense.id } }">
              <v-icon>mdi-delete</v-icon> Delete
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #mobile>
        <v-list>
          <v-list-item @click="print" prepend-icon="mdi-printer">
            Print
          </v-list-item>
        </v-list>
      </template>
    </Header>
    <v-container>
      <v-card variant="flat">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <h3>Date: {{ formattedDate(expense.date) }}</h3>
              <p></p>
            </v-col>
            <v-col cols="12">
              <h3>Description</h3>
              <p>{{ expense.description }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="3" align="end">
              <h3>Subtotal</h3>
              <p>{{ formatCurrency(expense.subtotal) }}</p>
            </v-col>
            <v-col cols="12" sm="3" align="end">
              <h3>Taxes</h3>
              <p v-for="tax in expense.Taxes">{{ taxLabel(tax) }}</p>
            </v-col>
            <v-col cols="12" sm="3" align="end">
              <h3>Total</h3>
              <h2 class="text-primary">{{ displayTotal }}</h2>
            </v-col>
            <v-col cols="12" sm="3" order-sm="first">
              <v-card variant="flat" color="grey-lighten-5">
                <v-card-text align="center">
                  
                  <h3>
                    <v-icon size="xx-large">{{ expense.PaymentType.icon }}</v-icon>
                    {{ expense.PaymentType.name }}
                  </h3>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="12" md="6">
          <h2>Invoice</h2>
          <InvoiceCard v-if="expense.Invoice.id" v-bind="expense.Invoice" @update:status="handleUpdateStatus">
            <template #bottomright>
              <Button color="primary" @click="showConfirmDetatch = true">
                Detatch
                <v-icon>mdi-paperclip-remove</v-icon>
              </Button>
            </template>
          </InvoiceCard>
          <v-card v-else variant="flat">
            <v-card-text class="text-center">
              <p class="mb-4">Not attached to an invoice</p>
              <Button color="primary" @click="showInvoiceBrowser = true">
                <v-icon>mdi-paperclip</v-icon> Attach to invoice
              </Button>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <h2>Receipt Photo (coming soon)</h2>
          <v-img v-if="expense.photo" src="https://via.placeholder.com/300" />
          <ReceiptUploader v-else :expenseId="expense.id" disabled />
        </v-col>
      </v-row>
      <ConfirmDeleteDialog 
        v-if="showConfirmDetatch"
        :title="`Are you sure you want to detatch this expense from Invoice: #${expense.Invoice.refNo}?`"
        @close="showConfirmDetatch = false"
        @confirm="handleDetatch" />
      <InvoiceBrowser v-if="showInvoiceBrowser" @attach="handleAttach" />
    </v-container>
  </template>
</template>