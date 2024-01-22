<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice, _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import { Button, ClientSelect, Select, TextField } from '@/components'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'Payments/_Dialog',
  inheritAttrs: false,
  components: { Button, ClientSelect, Select, TextField },
  emits: ['close', 'saved'],
  props: {
    clientId: {
      type: Number,
      default: undefined
    },
    invoiceId: {
      type: Number,
      default: undefined
    }
  },
  mounted() {
    this.form.clientId = this.clientId
    this.form.invoiceId = this.invoiceId
  },
  watch: {
    'form.clientId'(to) {
      if (to) {
        API.invoices.index({ clientId: to }).then(response => {
          this.invoices = response.data.items
        })
      }
      return this.invoices = []
    }
  },
  computed: {
    formattedDate: () => formatDateMMDDYYYY,
    clientInvoices() {
      if (this.form.clientId) {
        return this.invoices.map((invoice: _Invoice) => {
          if (invoice.clientId === this.form.clientId) {
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
      return this.form.clientId
        && this.form.invoiceId
        && this.form.amount
        && this.form.type
    },
    formattedPaymentTypes() {
      return this.types.map((type: _PaymentType) => ({
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
        clientId: undefined,
        invoiceId: undefined,
        amount: 0,
        type: undefined,
        description: ''
      }
      this.$emit('close')
    },
    async save() {
      try {
        const { clientId, invoiceId, amount, type, description, date } = this.form
        const response = await API.payments.store({
          clientId,
          invoiceId,
          amount: Number(amount),
          type,
          description,
          date  
        })
        if (response.data.id) {
          this.$emit('saved', response.data as _Payment)
          useToast().success('Payment saved')
          this.close()
        }
      } catch (err) {
        useToast().error('There was an error saving the payment')
        console.error(err)
      }
    }
  },
  data: (): {
    showDatePicker: boolean,
    form: Partial<_Payment>,
    invoices: _Invoice[],
    types: _PaymentType[],
  } => ({
    showDatePicker: false,
    invoices: [],
    form: {
      date: new Date(),
      clientId: undefined,
      invoiceId: undefined,
      amount: 0,
      type: undefined,
      description: ''
    },
    types: [
      {
        id: 1,
        name: 'Cash',
        icon: 'mdi-cash'
      },
      {
        id: 2,
        name: 'Check',
        icon: 'mdi-check'
      },
      {
        id: 3,
        name: 'Credit Card',
        icon: 'mdi-credit-card'
      },
      {
        id: 4,
        name: 'PayPal',
        icon: 'mdi-paypal'
      }
    ]
  })
})
</script>

<template>
  <v-dialog :model-value="true" v-bind="$attrs" persistent width="500">
    <v-card>
      <v-card-text>
        <v-form @submit.prevent="">
          <v-row v-show="!clientId && !invoiceId">
            <v-col>
              <ClientSelect v-model="form.clientId" :disabled="!!clientId" />
            </v-col>
          </v-row>
          <v-row v-show="!clientId && !invoiceId">
            <v-col>
              <Select v-model="form.invoiceId" :items="clientInvoices" label="Invoice" variant="outlined"
                :disabled="!clientInvoices.length || !!invoiceId" />
            </v-col>
          </v-row>
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
              <TextField v-model="form.amount" variant="outlined" label="Amount" prepend-inner-icon="mdi-currency-usd" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <TextField v-model="form.description" variant="outlined" label="Description" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <Select v-model="form.type" :items="formattedPaymentTypes" label="Type" variant="outlined" />
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