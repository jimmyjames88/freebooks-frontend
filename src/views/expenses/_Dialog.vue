<script lang="ts">
import { defineComponent } from 'vue'
import { _Collection, _ExpenseInputCreate, _Invoice, _PaymentType } from '@jimmyjames88/freebooks-types'
import { 
  Button, ClientSelect, DatePicker, InvoiceSelect, PaymentTypeSelect, Select, TextField
} from '@/components'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import { useToast } from 'vue-toastification'
import { Expense, Invoice } from '@/classes'
import InvoiceComposable from '@/composables/Invoice'

export default defineComponent({
  name: 'Expenses/_Dialog',
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
  data: (): {
    form: Expense
    invoices: Invoice[]
    paymentTypes?: _PaymentType[]
  } => ({
    invoices: [],
    form: new Expense(),
    paymentTypes: []
  }),
  mounted() {
    if (this.InvoiceId) this.form.InvoiceId = this.InvoiceId
  },
  watch: {
    async 'ClientId'(to) {
      if (to) {
        const response = await API.invoices.index({ ClientId: to })
        this.invoices = response?.data.items
      }
      return this.invoices = []
    }
  },
  computed: {
    formattedDate: () => formatDateMMDDYYYY,
    // clientInvoices() {
    //   if (this.ClientId) {
    //     return this.invoices.map((invoice: Invoice) => {
    //       console.log(1)
    //       if (invoice.Client.id === this.ClientId) {
    //         console.log(2)
    //         return {
    //           title: `#${invoice.refNo} - $${invoice.total}`,
    //           value: invoice.id
    //         }
    //       }
    //     })
    //   }
    //   return []
    // },
    submittable() {
      return this.form.date
        && this.form.subtotal
        && this.form.PaymentTypeId
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
      this.form = new Expense()
      this.$emit('close')
    },
    async save() {
      if (this.disableAPI) {
        this.Invoice.Expenses?.push(this.form)
        this.close()
        return
      }

      try {
        // const { InvoiceId, subtotal, PaymentTypeId, description, date } = this.form
        // const response = await API.expenses.store({
        //   InvoiceId,
        //   subtotal: Number(subtotal),
        //   PaymentTypeId,
        //   description: description || '',
        //   date: date || new Date()
        // })
        await this.form.save()
        if (this.form.id) {
          this.$emit('saved', this.form)
          useToast().success('Expense saved')
          this.close()
        }
      } catch (err) {
        useToast().error('There was an error saving the Expense')
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
        <v-form @submit.prevent="">
          <v-row>
            <v-col>
              <DatePicker v-model="form.date" />
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
              <PaymentTypeSelect v-model="form.PaymentTypeId" />
            </v-col>
          </v-row>
          <v-divider class="mt-4 mb-8" />
          <v-row v-show="!ClientId && !InvoiceId">
            <v-col>
              <ClientSelect
                v-model="ClientId"
                :disabled="!!ClientId"
                :return-object="false"
              />
            </v-col>
          </v-row>
          <v-row v-show="!ClientId && !InvoiceId">
            <v-col>
              <InvoiceSelect v-if="form.InvoiceId" v-model="form.InvoiceId" :disabled="!ClientId" :ClientId="ClientId" />
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