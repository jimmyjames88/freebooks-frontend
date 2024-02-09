<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AxiosError, AxiosResponse } from 'axios'
import { _Client, _Invoice, _LineItem, _Payment, _Tax, _User } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import {
  AutoComplete, Button, ClientSelect, Spinner, TextField, TextArea
} from '@/components';
import { Expenses, InvoiceTotals, LineItems, Payments } from './components'
import ExpenseDialog from '../expenses/_Dialog.vue'
import PaymentDialog from '../payments/_Dialog.vue'
import Invoice from '@/classes/Invoice'
import InvoiceComposable from '@/composables/Invoice';


export default defineComponent({
  setup() {
    const { Invoice, expensesTotal, subtotal, tax, total, paymentsTotal, amountDue } = InvoiceComposable()
    return { Invoice, expensesTotal, subtotal, tax, total, paymentsTotal, amountDue }
  },
  components: {
    AutoComplete, Button, ClientSelect, Expenses, ExpenseDialog, InvoiceTotals, LineItems,
    PaymentDialog, Payments, Spinner, TextField, TextArea
  },
  emits: [ 'submitForm' ],
  data: (): {
    latestRefNo?: string,
    issueDatePicker: boolean,
    dueDatePicker: boolean,
    taxOptions: _Tax[],
    showExpenseDialog: boolean
    showPaymentDialog: boolean
  } => ({
    latestRefNo: undefined,
    issueDatePicker: false,
    dueDatePicker: false,
    taxOptions: [],
    showExpenseDialog: false,
    showPaymentDialog: false
  }),
  mounted() {
    // this.Invoice.refNo = this.Invoice.refNo || ''
    
    this.loadLatestRefNo()
    this.loadTaxOptions()
  },
  props: {
    modelValue: {
      type: Object as PropType<_Invoice>,
      default: () => ({})
    },
    editing: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    noEmptyLineItems() {
      return this.Invoice.lineItems.filter((lineItem: _LineItem) => {
        const { description, rate, quantity } = lineItem
        return description || rate || quantity
      })
    },
    inactiveTaxOptions() {
      return this.taxOptions.filter((tax: _Tax) => !this.Invoice.Taxes.find((t: _Tax) => t.id === tax.id))
    }
  },
  methods: {
    // applyFormData() {
    //   if (!this.formData) return
    //   const { ClientId, refNo, issueDate, dueDate, lineItems, notes, taxes, expenses, payments } = this.formData
    //   this.ClientId = ClientId
    //   this.refNo = refNo
    //   this.issueDate = issueDate
    //   this.dueDate = dueDate
    //   this.notes = notes
    //   this.Taxes.push(...Taxes)
    //   this.Expenses.push(...Expenses)
    //   this.Payments.push(...Payments)

    //   if (lineItems.length > 0) {
    //     this.lineItems = lineItems
    //   }
    // },
    applyTax(tax: _Tax) {
      // check if tax exists before applying
      console.log('apply', tax)
      if (this.Invoice.Taxes.find((t: _Tax) => t.id === tax.id)) return
      this.Invoice.Taxes.push(tax)
    },
    removeTax(id: number) {
      this.Invoice.Taxes = this.Invoice.Taxes.filter((tax: _Tax) => tax.id !== id)
    },
    async loadLatestRefNo() {
      this.latestRefNo = await API.invoices.latestRefNo()
    },
    loadTaxOptions() {
      API.taxes.index().then((response: AxiosResponse) => {
        this.taxOptions = response.data
        // If not in edit mode, apply default taxes
        if (!this.editing)
          this.Invoice.Taxes = response.data.filter((tax: _Tax) => tax.default)
      }).catch((err: AxiosError) => {
        console.warn(err)
      })
    },
    formatDate(str: string | Date | undefined): string {
      if (!str) return ''
      const date = new Date(str)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    },
    submitForm() {
      this.$emit('submitForm')
    },
    goBack() {
      // todo add confirmation if form is dirty
      this.$router.go(-1)
    }
  }
})
</script>

<template>
  <v-form @submit.prevent="submitForm" validate-on="submit" :disabled="loading">
    <div class="document">
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <ClientSelect v-if="Invoice.Client" v-model="Invoice.Client" />
          <router-link :to="{ name: 'Clients/Create' }" class="ml-2">
            <v-icon size="xsmall">mdi-account-plus</v-icon> Add Client
          </router-link>
        </v-col>
        <v-col cols="12" sm="4">
          <TextField v-model="Invoice.refNo" label="Ref #" prepend-inner-icon="mdi-pound" variant="outlined"
            :hint="latestRefNo ? `Last used: ${latestRefNo}` : 'Reference number, can be anything you want'" />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="12" sm="6" md="4" class="datepicker-col">
          <v-menu v-model="issueDatePicker" location="end" scrim="true">
            <template v-slot:activator="{ props }">
              <TextField :value="formatDate(Invoice.issueDate)" v-bind="props" id="issueDate" label="Issue Date"
                prepend-inner-icon="mdi-calendar-month" variant="outlined" messages="MM/DD/YYYY" />
            </template>
            <v-date-picker color="tertiary" v-model="Invoice.issueDate" theme="light"
              @update:model-value="issueDatePicker = false" />
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="datepicker-col">
          <v-menu v-model="dueDatePicker" :close-on-content-click="false" location="end" scrim="true">
            <template v-slot:activator="{ props }">
              <TextField :value="formatDate(Invoice.dueDate)" v-bind="props" id="dueDate" label="Due Date"
                prepend-inner-icon="mdi-calendar" variant="outlined" messages="MM/DD/YYYY" />
            </template>
            <v-date-picker color="tertiary" v-model="Invoice.dueDate" theme="light" @update:model-value="dueDatePicker = false" />
          </v-menu>
        </v-col>
      </v-row>
    </div>
    <div class="document mt-8">
      <v-row>
        <v-col>
          <LineItems v-model:lineItems="Invoice.lineItems" />
        </v-col>
      </v-row>
    </div>
    <div class="document mt-8">
      <Expenses v-if="Invoice?.Expenses?.length" :expenses="Invoice.Expenses" />
      <v-row class="mt-4">
        <v-col align="end">
          <v-menu>
            <template #activator="{ props }">
              <Button v-bind="props" color="primary">
                <v-icon>mdi-plus</v-icon> Add Expense
              </Button>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Attach existing expense</v-list-item-title>
              </v-list-item>
              <v-list-item @click="showExpenseDialog = true">
                <v-list-item-title>Create new expense</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <ExpenseDialog v-if="showExpenseDialog"
        :ClientId="Invoice.Client?.id"
        :InvoiceId="Invoice.id"
        disableAPI
        @close="showExpenseDialog = false"
      />
    </div>
    <div class="document mt-8">
      <Payments v-if="Invoice.Payments?.length" />
      <v-row class="mt-4">
        <v-col align="end">
          <Button color="primary" @click="showPaymentDialog = true">
            <v-icon>mdi-plus</v-icon> Add Payment
          </Button>
        </v-col>
      </v-row>
      <PaymentDialog v-if="showPaymentDialog"
        :ClientId="Invoice.Client?.id"
        :InvoiceId="Invoice.id"
        disableAPI
        @close="showPaymentDialog = false"
      />
    </div>
    <div class="document mt-8">
      <v-row>
        <v-col cols="12" sm="6">
          <TextArea v-model="Invoice.notes" label="Notes" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right mt-sm-4">
          <InvoiceTotals />
        </v-col>
      </v-row>
    </div>
    <v-row class="mt-2">
      <v-col align="end">
        <Button color="secondary" type="submit">
          <v-icon>mdi-content-save</v-icon> Save
        </Button>
        <Button color="transparent" @click="goBack">
          <v-icon>mdi-close-circle</v-icon> Cancel
        </Button>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped>
:global(input.db__input) {
  border-radius: 0 !important;
  border: 1px solid #9A8F99 !important;
  height: 56px !important;
}
</style>