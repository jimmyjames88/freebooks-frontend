<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosError, AxiosResponse } from 'axios'
import { _Client, _Invoice, _LineItem, _Tax } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { 
  AutoComplete,
  Button,
  ClientSelect,
  LineItems,
  Spinner,
  TextField,
  TextArea
} from '../../components';


export default defineComponent({
  components: { 
    AutoComplete,
    Button,
    ClientSelect,
    LineItems,
    Spinner,
    TextField,
    TextArea
  },
  data: (): {
    clientId: number | undefined,
    latestRefNo: string | undefined,
    refNo: string,
    issueDate: Date | undefined,
    issueDatePicker: boolean,
    dueDate: Date | undefined,
    dueDatePicker: boolean,
    lineItems: _LineItem[],
    notes: string,
    taxes: _Tax[],
    taxOptions: _Tax[],
    submitting: boolean
  } => ({
    clientId: undefined,
    latestRefNo: undefined,
    refNo: '',
    issueDate: new Date(),
    issueDatePicker: false,
    dueDate: undefined,
    dueDatePicker: false,
    lineItems: [
      { type: '', description: '', rate: null, quantity: null }
    ],
    notes: '',
    taxes: [],
    taxOptions: [],
    submitting: false
  }),
  mounted() {
    this.loadLatestRefNo()
    this.loadTaxOptions()
  },
  watch: {
    formData: {
      handler() {
        this.applyFormData()
      }
    }
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    subtotal(): string {
      const sub = this.lineItems.reduce((acc, lineItem) => {
        const rate = Number(lineItem.rate || 0)
        const quantity = Number(lineItem.quantity || 0)
        if (isNaN(rate) || isNaN(quantity)) return Number(acc)
        return Number(acc) + rate * quantity
      }, 0)
      return sub.toFixed(2)
    },
    tax(): string {
      return this.taxes.reduce((acc, tax) => {
        if (tax.type === 'PERCENTAGE') {
          return Number(acc) + (Number(this.subtotal) * tax.rate)
        }
        return Number(acc) + tax.rate
      }, 0).toFixed(2)
    },
    total(): string {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2)
    },
    noEmptyLineItems() {
      return this.lineItems.filter((lineItem: _LineItem) => {
        const { description, rate, quantity } = lineItem
        return description || rate || quantity
      })
    },
    inactiveTaxOptions() {
      return this.taxOptions.filter((tax: _Tax) => !this.taxes.find((t: _Tax) => t.id === tax.id))
    }
  },
  methods: {
    applyFormData() {
      if (!this.formData) return
      const { clientId, refNo, issueDate, dueDate, lineItems, notes, taxes } = this.formData
      this.clientId = clientId
      this.refNo = refNo
      this.issueDate = issueDate
      this.dueDate = dueDate
      this.notes = notes
      this.taxes = taxes

      if (lineItems.length > 0) {
        this.lineItems = lineItems
      }
    },
    applyTax(tax: _Tax) {
      // check if tax exists before applying
      console.log('apply', tax)
      if (this.taxes.find((t: _Tax) => t.id === tax.id)) return
      this.taxes.push(tax)
    },
    removeTax(id: number) {
      this.taxes = this.taxes.filter((tax: _Tax) => tax.id !== id)
    },
    loadLatestRefNo() {
      API.invoices.latestRefNo().then((response: AxiosResponse) => {
        if(response.data.refNo !== '0')
          this.latestRefNo = response.data.refNo
      }).catch((err: AxiosError) => {
        console.warn(err)
      })
    },
    loadTaxOptions() {
      API.taxes.index().then((response: AxiosResponse) => {
        this.taxOptions = response.data
        // If not in edit mode, apply default taxes
        if (!this.editing)
          this.taxes = response.data.filter((tax: _Tax) => tax.default)
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
      this.submitting = true
      this.$emit('submitForm', {
        clientId: this.clientId,
        refNo: this.refNo,
        issueDate: this.issueDate,
        dueDate: this.dueDate,
        lineItems: this.noEmptyLineItems,
        notes: this.notes,
        taxes: this.taxes
      })
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
          <ClientSelect v-model="clientId" />
          <router-link :to="{ name: 'Clients/Create' }" class="ml-2">
            <v-icon size="xsmall">mdi-account-plus</v-icon> Add Client
          </router-link>
        </v-col>
        <v-col cols="12" sm="4">
          <TextField 
            v-model="refNo"
            label="Ref #"
            prepend-inner-icon="mdi-pound"
            variant="outlined"
            :hint="latestRefNo ? `Last used: ${latestRefNo}` : 'Reference number, can be anything you want'"
          />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="12" sm="6" md="4" class="datepicker-col">
          <v-menu v-model="issueDatePicker" location="end" scrim="true">
            <template v-slot:activator="{ props }">
              <TextField
                :value="formatDate(issueDate)"
                v-bind="props"
                id="issueDate"
                label="Issue Date"
                prepend-inner-icon="mdi-calendar-month"
                variant="outlined"
                messages="MM/DD/YYYY"
              />
            </template>
            <v-date-picker color="tertiary" v-model="issueDate" theme="light" @update:model-value="issueDatePicker = false" />
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="datepicker-col">
          <v-menu v-model="dueDatePicker" :close-on-content-click="false" location="end" scrim="true">
            <template v-slot:activator="{ props }">
              <TextField
                :value="formatDate(dueDate)"
                v-bind="props"
                id="dueDate"
                label="Due Date"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                messages="MM/DD/YYYY"
              />
            </template>
            <v-date-picker color="tertiary" v-model="dueDate" theme="light" @update:model-value="dueDatePicker = false" />
          </v-menu>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col>
          <LineItems v-model:lineItems="lineItems"/>
        </v-col>
      </v-row>
      <v-divider class="mt-8 mb-8" />
      <v-row>
        <v-col cols="12" sm="6">
          <TextArea v-model="notes" label="Notes" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" class="text-right mt-sm-4">
          <v-row>
            <v-col cols="6">Subtotal</v-col>
            <v-col cols="6">${{ subtotal }}</v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row v-for="tax in taxes">
            <v-col cols="6">
              <v-btn icon size="small" variant="flat" @click="removeTax(tax.id)">
                <v-icon color="primary">mdi-close</v-icon>
              </v-btn>
              {{ tax.name }}
              <span v-if="tax.type === 'PERCENTAGE'">({{ tax.rate * 100 }}%)</span>
            </v-col>
            <v-col cols="6">
              {{ tax.type === 'PERCENTAGE' ? '$' + (parseFloat(subtotal) * tax.rate).toFixed(2) : '$' + tax.rate.toFixed(2)  }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="flat" color="transparent" :disabled="!inactiveTaxOptions.length">
                    <v-icon>mdi-bank-plus</v-icon> Add tax
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="tax in inactiveTaxOptions" @click="applyTax(tax)">
                    {{ tax.name }}/{{ tax.type }}/{{ tax.rate }}
                  </v-list-item>
                </v-list>
              </v-menu> 
            </v-col>
          </v-row>
          <v-divider class="my-4" />
          <v-row>
            <v-col cols="6">
              <h2>Total</h2>
            </v-col>
            <v-col cols="6">
              <h2>${{ total }}</h2>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-row class="mt-2">
      <v-col align="end">
        <Button color="secondary" type="submit" :loading="submitting">
          <v-icon>mdi-content-save</v-icon> Save
        </Button>
        <Button color="transparent" @click="goBack" :disabled="submitting">
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