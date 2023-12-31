<script lang="ts">
import { defineComponent } from 'vue'
import { _Client, _Invoice, _LineItem } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { AutoComplete, Button, LineItems, TextField, TextArea } from '../../components';


export default defineComponent({
  components: { AutoComplete, Button, LineItems, TextField, TextArea },
  data: (): {
    clients: _Client[],
    clientId: number | undefined,
    latestRefNo: string | undefined,
    refNo: string,
    issueDate: Date | undefined,
    issueDatePicker: boolean,
    dueDate: Date | undefined,
    dueDatePicker: boolean,
    lineItems: _LineItem[],
    notes: string
  } => ({
    clients: [],
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
    notes: ''
  }),
  mounted() {
    this.loadLatestRefNo()
    this.loadClientList()
  },
  watch: {
    formData: {
      handler() {
        this.applyFormData()
      }
    }
  },
  props: {
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
    clientList(): _Client[] {
      return this.clients.map((client: _Client) => ({
        value: client.id,
        title: client.name
      })).sort((a: _Client, b: _Client) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
        return 0
      })
    },
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
      return (parseFloat(this.subtotal) * 0.05).toFixed(2)
    },
    total(): string {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2)
    },
    noEmptyLineItems() {
      return this.lineItems.filter((lineItem: _LineItem) => {
        const { description, rate, quantity } = lineItem
        return description || rate || quantity
      })
    }
  },
  methods: {
    applyFormData() {
      if (!this.formData) return
      const { clientId, refNo, issueDate, dueDate, lineItems, notes } = this.formData
      this.clientId = clientId
      this.refNo = refNo
      this.issueDate = issueDate
      this.dueDate = dueDate
      this.notes = notes

      if (lineItems.length > 0) {
        this.lineItems = lineItems
      }
    },
    async loadClientList() {
      await API.clients.list().then((response: AxiosResponse) => {
        this.clients = response.data
        if (this.$route.query.clientId)
          this.clientId = Number(this.$route.query.clientId)
      }).catch((err: AxiosError) => {
        console.warn(err)
      })
    },
    async loadLatestRefNo() {
      await API.invoices.latestRefNo().then((response: AxiosResponse) => {
        if(response.data.refNo !== '0')
          this.latestRefNo = response.data.refNo
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
      this.$emit('submitForm', {
        clientId: this.clientId,
        refNo: this.refNo,
        issueDate: this.issueDate,
        dueDate: this.dueDate,
        lineItems: this.noEmptyLineItems,
        notes: this.notes
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
          <AutoComplete 
            v-model="clientId"
            :items="clientList"
            label="Client" 
            variant="outlined" 
            prepend-inner-icon="mdi-account" 
            clearable 
          />
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
          <v-menu v-model="issueDatePicker" :close-on-content-click="false" location="end" scrim="true">
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
          <v-row>
            <v-col cols="6">Tax</v-col>
            <v-col cols="6">${{ tax }}</v-col>
          </v-row>
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