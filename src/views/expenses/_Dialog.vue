<script lang="ts">
import { defineComponent } from 'vue'
import { _Collection, _Invoice, _Expense, _PaymentType } from '@jimmyjames88/freebooks-types'
import { Button, ClientSelect, InvoiceSelect, PaymentTypeSelect, Select, TextField } from '@/components'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import { useToast } from 'vue-toastification'
import Invoice from '@/classes/Invoice'
import Expense from '@/classes/Expense'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Expenses/_Dialog',
  inheritAttrs: false,
  components: { Button, ClientSelect, InvoiceSelect, PaymentTypeSelect, Select, TextField },
  emits: ['close', 'saved'],
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  },
  props: {
    ClientId: {
      type: Number,
      default: undefined
    },
    disableAPI: {
      type: Boolean,
      default: false
    },
    InvoiceId: {
      type: Number,
      default: undefined
    }
  },
  mounted() {
    this.form.ClientId = this.ClientId
    this.form.InvoiceId = this.InvoiceId
  },
  watch: {
    async 'form.ClientId'(to) {
      if (to) {
        const data: _Collection<Invoice> = await API.invoices.index({ ClientId: to })
        if (data.items) {
          return this.invoices = data.items
        }
      }
      return this.invoices = []
    }
  },
  computed: {
    formattedDate: () => formatDateMMDDYYYY,
    clientInvoices() {
      if (this.form.ClientId) {
        return this.invoices.map((invoice: Invoice) => {
          if (invoice.Client.id === this.form.ClientId) {
            return {
              title: `#${invoice.refNo} - $${invoice.total}`,
              value: invoice.id
            }
          }
        })
      }
      return []
    },
    submittable() {
      return this.form.date
        && this.form.subtotal
        && this.form.paymentTypeId
    },
    formattedPaymentTypes() {
      return this.paymentTypes?.map((type: _PaymentType) => ({
        value: type.id,
        title: type.name,
        icon: type.icon
      }))
    }
  },
  methods: {
    close() {
      this.form = {
        date: new Date(),
        ClientId: undefined,
        InvoiceId: undefined,
        subtotal: 0,
        paymentTypeId: undefined,
        description: ''
      }
      this.$emit('close')
    },
    async save() {
      if (this.disableAPI) {
        const expense = new Expense({
          date: this.form.date,
          subtotal: Number(this.form.subtotal),
          paymentTypeId: this.form.paymentTypeId,
          description: this.form.description,
          InvoiceId: this.Invoice.id,
          UserId: this.Invoice.User?.id
        })
        this.Invoice.Expenses?.push(expense)
        this.close()
        return
      }

      try {
        const { InvoiceId, subtotal, paymentTypeId, description, date } = this.form
        const expense = await API.expenses.store({
          InvoiceId,
          subtotal: Number(subtotal),
          paymentTypeId,
          description: description || '',
          date: date || new Date()
        })
        if (expense.id) {
          this.$emit('saved', expense)
          useToast().success('Expense saved')
          this.close()
        }
      } catch (err) {
        useToast().error('There was an error saving the Expense')
        console.error(err)
      }
    }
  },
  data: (): {
    showDatePicker: boolean
    form: Partial<Expense> & Record<string, any>
    invoices: Invoice[]
    paymentTypes?: _PaymentType[]
  } => ({
    showDatePicker: false,
    invoices: [],
    form: {
      date: new Date(),
      ClientId: undefined,
      InvoiceId: undefined,
      subtotal: 0,
      paymentTypeId: undefined,
      description: ''
    },
    paymentTypes: [
      { id: 1, name: 'Cash', icon: 'mdi-cash' },
      { id: 2, name: 'Check', icon: 'mdi-check' },
      { id: 3, name: 'Credit Card', icon: 'mdi-credit-card' },
      { id: 4, name: 'PayPal', icon: 'mdi-paypal' }
    ]
  })
})
</script>

<template>
  <v-dialog :model-value="true" v-bind="$attrs" persistent width="500">
    <v-card>
      <v-card-text>
        <v-form @submit.prevent="">
          <v-row>
            <v-col>
              <v-menu v-model="showDatePicker" location="end" scrim="true">
                <template v-slot:activator="{ props }">
                  <TextField :value="formattedDate(form.date)" v-bind="props" id="issueDate" label="Date"
                    prepend-inner-icon="mdi-calendar-month" variant="outlined" messages="MM/DD/YYYY" />
                </template>
                <v-date-picker color="tertiary" v-model="form.date" theme="light"
                  @update:model-value="showDatePicker = false" />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <TextField v-model="form.subtotal" variant="outlined" label="Subtotal" prepend-inner-icon="mdi-currency-usd" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <TextField v-model="form.description" variant="outlined" label="Description" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <PaymentTypeSelect v-model="form.paymentTypeId" />
            </v-col>
          </v-row>
          <v-divider class="mt-4 mb-8" />
          <v-row v-show="!ClientId && !InvoiceId">
            <v-col>
              <ClientSelect v-model="form.ClientId" :disabled="!!ClientId" />
            </v-col>
          </v-row>
          <v-row v-show="!ClientId && !InvoiceId">
            <v-col>
              <InvoiceSelect v-model="form.InvoiceId" :disabled="!form.ClientId" :ClientId="form.ClientId" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <Button @click="close">Cancel</Button>
        <Button @click="save" color="primary" :disabled="!submittable">Save</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>