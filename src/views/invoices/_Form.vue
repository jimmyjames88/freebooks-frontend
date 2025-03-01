<script lang="ts">
import { defineComponent } from 'vue'
import { _Client, _Invoice, _LineItem, _Payment, _Tax, _User } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import {
  AutoComplete, Button, ClientSelect, DatePicker, Spinner, TaxSelect, TextField, TextArea
} from '@/components';
import { Expenses, Totals, LineItems, Payments } from '@/components'
import ExpenseDialog from '../expenses/_Dialog.vue'
import ExpenseBrowser from '../expenses/_Browser.vue'
import PaymentDialog from '../payments/_Dialog.vue'
import InvoiceComposable from '@/composables/Invoice';

export default defineComponent({
  setup() {
    const { Invoice } = InvoiceComposable()
    return { Invoice }
  },
  components: {
    AutoComplete, Button, ClientSelect, DatePicker, Expenses, ExpenseBrowser, ExpenseDialog, Totals, LineItems,
    PaymentDialog, Payments, Spinner, TextField, TextArea, TaxSelect
  },
  emits: [ 'submitForm' ],
  data: (): {
    latestRefNo?: string
    showExpenseDialog: boolean
    showExpenseBrowser: boolean
    showPaymentDialog: boolean
  } => ({
    latestRefNo: undefined,
    showExpenseDialog: false,
    showExpenseBrowser: false,
    showPaymentDialog: false,
  }),
  mounted() {
    this.loadLatestRefNo()
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    async clientId(id: number) {
      this.Invoice.Client.get(id)
    }
  },
  computed: {
    clientId() {
      return this.Invoice.Client?.id
    },
    noEmptyLineItems() {
      return this.Invoice.LineItems.filter((lineItem: _LineItem) => {
        const { description, rate, quantity } = lineItem
        return description || rate || quantity
      })
    }
  },
  methods: {
    async loadLatestRefNo() {
      const response = await API.invoices.latestRefNo()
      this.latestRefNo = response?.data.refNo
    },
    formatDate(str: string | Date): string {
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
          <ClientSelect v-if="Invoice.Client" v-model="Invoice.Client.id" />
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
          <DatePicker
            v-model="Invoice.issueDate"
            color="tertiary"
            theme="light" />
        </v-col>
        <v-col cols="12" sm="6" md="4" class="datepicker-col">
          <DatePicker
            v-model="Invoice.dueDate"
            color="tertiary"
            theme="light" />
        </v-col>
      </v-row>
    </div>
    <div class="document mt-8">
      <v-row>
        <v-col>
          <LineItems v-model:LineItems="Invoice.LineItems" />
        </v-col>
      </v-row>
    </div>
    <div class="document mt-8">
      <Expenses v-if="Invoice?.Expenses?.length" :expenses="Invoice.Expenses" deleteable />
      <v-row class="mt-4">
        <v-col align="end">
          <v-menu>
            <template #activator="{ props }">
              <Button v-bind="props" color="primary">
                <v-icon>mdi-paperclip</v-icon> Attach Expense
              </Button>
            </template>
            <v-list>
              <v-list-item 
                prepend-icon="mdi-magnify"
                @click="showExpenseBrowser = true"
              >
                <v-list-item-title>Browse expenses</v-list-item-title>
              </v-list-item>
              <v-list-item 
                prepend-icon="mdi-cash-plus"
                @click="showExpenseDialog = true"
              >
                <v-list-item-title>New expense</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <ExpenseDialog v-if="showExpenseDialog"
        :ClientId="Invoice.Client.id"
        :InvoiceId="Invoice.id"
        disableAPI
        @close="showExpenseDialog = false"
      />
      <ExpenseBrowser v-if="showExpenseBrowser"
        :ClientId="Invoice.Client?.id"
        :InvoiceId="Invoice.id"
        disableAPI
        @close="showExpenseBrowser = false"
      />
    </div>
    <div class="document mt-8">
      <Payments v-if="Invoice.Payments?.length" deleteable />
      <v-row class="mt-4">
        <v-col align="end">
          <Button
            color="primary"
            @click="showPaymentDialog = true"
          >
            <v-icon>mdi-cash-plus</v-icon> Add Payment
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
    <div class="document mt-8 w-50 ml-auto">
      <h2>Taxes</h2>
      <TaxSelect v-model="Invoice.Taxes" />
    </div>
    <div class="document mt-8">
      <v-row>
        <v-col cols="12" sm="6">
          <TextArea v-model="Invoice.notes" label="Notes" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right mt-sm-4">
          <Totals />
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