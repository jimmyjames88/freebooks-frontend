<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice, _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import { Button, ClientSelect, InvoiceSelect, PaymentTypeSelect, Select, TextField } from '@/components'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import { useToast } from 'vue-toastification'
import { Payment } from '@/classes'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Payments/_Dialog',
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
    },
  },
  data: (): {
    showDatePicker: boolean,
    form: Partial<_Payment>,
    invoices: _Invoice[]
  } => ({
    showDatePicker: false,
    invoices: [],
    form: {
      date: new Date(),
      ClientId: undefined,
      InvoiceId: undefined,
      paymentTypeId: undefined,
      amount: 0,
      description: ''
    }
  }),
  async mounted() {
    this.form.InvoiceId = this.InvoiceId
    this.form.ClientId = this.ClientId
  },
  computed: {
    formattedDate: () => formatDateMMDDYYYY,
    submittable() {
      return this.form.ClientId
        && (this.form.InvoiceId || this.disableAPI)
        && this.form.amount
        && this.form.paymentTypeId
    }
  },
  methods: {
    close() {
      this.form = {
        date: new Date(),
        ClientId: undefined,
        InvoiceId: undefined,
        amount: 0,
        paymentTypeId: undefined,
        description: ''
      }
      this.$emit('close')
    },
    async save() {
      if (this.disableAPI) {
        // this.form.amount = Number(this.form.amount)
        // this.Invoice.Payments.push(this.form)
        const payment = new Payment({ ...this.form, ClientId: this.Invoice.Client?.id })
        this.Invoice.Payments?.push(payment)
        this.close()
        return
      }

      try {
        const { ClientId, InvoiceId, paymentTypeId, amount, description, date } = this.form
        const payment = await API.payments.store({
          ClientId,
          InvoiceId,
          paymentTypeId,
          amount: Number(amount),
          description,
          date  
        })
        if (payment.id) {
          this.$emit('saved', payment)
          useToast().success('Payment saved')
          this.close()
        }
      } catch (err) {
        useToast().error('There was an error saving the payment')
        console.error(err)
      }
    }
  }
})
</script>

<template>
  <v-dialog :model-value="true" v-bind="$attrs" persistent width="500">
    <v-card>
      <v-card-text>
        <v-form @submit.prevent>
          <v-row v-show="!ClientId && !InvoiceId">
            <v-col>
              <ClientSelect v-model="form.ClientId" :disabled="!!ClientId" />
            </v-col>
          </v-row>
          <v-row v-show="!ClientId && !InvoiceId">
            <v-col>
              <InvoiceSelect v-model="form.InvoiceId"
                :disabled="!form.ClientId"
                :ClientId="form.ClientId"
              />
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
              <PaymentTypeSelect v-model="form.paymentTypeId" />
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