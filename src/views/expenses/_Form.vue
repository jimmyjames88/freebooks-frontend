<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _Expense, _TaxType } from '@jimmyjames88/freebooks-types'
import { Button, Checkbox, DatePicker, PaymentTypeSelect, TaxSelect, TextField } from '@/components'
import { Expense, Tax } from '@/classes'
import { formatDateMMDDYYYY, formatCurrency } from '@/utils'

export default defineComponent({
  name: 'Expenses/_Form',
  components: { Button, Checkbox, DatePicker, PaymentTypeSelect, TaxSelect, TextField },
  props: {
    expense: {
      type: Object as PropType<_Expense>,
      required: true
    }
  },
  data: (): {
    form: Expense
    taxList: Tax[]
    taxSelected: number[]
  } => ({
    form: new Expense(),
    taxList: [],
    taxSelected: [] as number[]
  }),
  computed: {
    formatCurrency: () => formatCurrency,
    formattedDate: () => formatDateMMDDYYYY,
    submittable() {
      return this.form.date 
        && this.form.PaymentTypeId
        && this.form.description
        && this.form.subtotal
    },
    taxTotal() {
      return this.taxSelected.reduce((acc, taxId) => {
        const tax = this.taxList.find(tax => tax.id === taxId)
        if (!tax) return acc
        return tax.type === _TaxType.PERCENTAGE
          ? acc + (this.form.subtotal * tax.rate)
          : acc + tax.rate
      }, 0)
    },
    total() {
      // calculate total from the subtotal + selected taxes  
      return Number(this.form.subtotal) + Number(this.taxTotal)
    }
  },
  mounted() {
    this.form = new Expense(this.expense)
  },
  methods: {
    async submitForm() {
      this.form.Taxes = this.taxSelected.map(taxId => this.taxList.find(tax => tax.id === taxId)) as Tax[]
      this.$emit('submitForm', this.form)
    },
    goBack() {
      // todo add confirmation if form is dirty
      this.$router.go(-1)
    },
    handleDateChange(value: Date) {
      this.form.date = value
    }
  }
})
</script>

<template>
  <v-form @submit.prevent="">
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <DatePicker v-model="form.date" label="Expense date" />
      </v-col>
      <v-col cols="12" md="4" lg="3">
        <PaymentTypeSelect v-model="form.PaymentTypeId" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TextField v-model="form.description" variant="outlined" label="Description" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3">
        <TextField v-model="form.subtotal" variant="outlined" label="Subtotal" prepend-inner-icon="mdi-currency-usd" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TaxSelect v-model="taxSelected" />
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <v-row align="center">
      <v-col>
        <h3>Subtotal: {{ formatCurrency(form.subtotal) }}</h3>
      </v-col>

      <v-col align="center">
        <h3>Tax: {{ formatCurrency(taxTotal) }}</h3>
      </v-col>

      <v-col align="end">
        <h2>Total: {{ formatCurrency(total) }}</h2>
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col align="end">
        <Button :disabled="!submittable" @click="submitForm" color="secondary">
          <v-icon>mdi-content-save</v-icon> Save
        </Button>
        <Button @click="goBack" color="transparent">
          <v-icon>mdi-close-circle</v-icon> Cancel
        </Button>
      </v-col>
    </v-row>
  </v-form>
</template>