<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice, _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import { 
  Button, ClientSelect, DatePicker, InvoiceSelect, PaymentTypeSelect, Select, TextField
} from '@/components'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import { useToast } from 'vue-toastification'
import { Payment } from '@/classes'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Payments/_Dialog',
  inheritAttrs: false,
  components: {
    Button, ClientSelect, DatePicker, InvoiceSelect, PaymentTypeSelect, Select, TextField
  },
  emits: ['close', 'saved'],
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  },
  props: {
    ClientId: {
      type: Number,
      default: -1
    },
    disableAPI: {
      type: Boolean,
      default: false
    },
    InvoiceId: {
      type: Number,
      default: -1
    },
  },
  data: (): {
    showDatePicker: boolean,
    form: Payment,
    invoices: _Invoice[]
  } => ({
    showDatePicker: false,
    invoices: [],
    form: new Payment({
      date: new Date(),
      ClientId: -1,
      InvoiceId: -1,
      amount: 0,
      description: '',
      PaymentTypeId: -1
    })
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
        && this.form.PaymentTypeId
    }
  },
  methods: {
    close() {
      this.form = new Payment({
        date: new Date(),
        ClientId: -1,
        InvoiceId: -1,
        amount: 0,
        PaymentTypeId: -1,
        description: ''
      })
      this.$emit('close')
    },
    async save() {
      if (this.disableAPI) {
        const payment = new Payment({ ...this.form, ClientId: this.Invoice.Client?.id })
        this.Invoice.Payments?.push(payment)
        this.close()
        return
      }

      try {
        const { ClientId, InvoiceId, PaymentTypeId, amount, description, date } = this.form
        const response = await API.payments.store({
          ClientId,
          InvoiceId,
          PaymentTypeId,
          amount: Number(amount),
          description,
          date
        })
        
        if (response?.status === 201) {
          this.$emit('saved', response)
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
              <ClientSelect v-model="form.ClientId" :disabled="!!ClientId" :return-object="false" />
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
              <DatePicker v-model="form.date" />
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
              <PaymentTypeSelect v-model="form.PaymentTypeId" />
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