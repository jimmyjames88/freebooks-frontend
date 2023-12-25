<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosError, AxiosResponse } from 'axios'
import { AutoComplete, Button, LineItems, Select, TextArea, TextField } from '@/components'
import API from '@/api'


export default defineComponent({
  name: 'Invoices/Create',
  components: { AutoComplete, Button, LineItems, Select, TextArea, TextField },
  data: (): {
    loading: boolean,
    clients: any[],
    clientId: number | undefined,
    refNo: string,
    issueDate: Date | undefined,
    issueDatePicker: boolean,
    dueDate: Date | undefined,
    dueDatePicker: boolean,
    lineItems: {
      type: string,
      description: string,
      rate: number | null,
      quantity: number | null
    }[],
    notes: string
  } => ({
    loading: true,
    clients: [],
    clientId: undefined,
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

  async mounted() {
    await API.clients.list().then((response: AxiosResponse) => {
      this.clients = response.data
      if (this.$route.query.clientId)
        this.clientId = Number(this.$route.query.clientId)
    }).catch((err: AxiosError) => {
      console.warn(err)
    }).finally(() => {
      this.loading = false
    })
  },

  computed: {
    clientList(): any {
      return this.clients.map((client: any) => ({
        value: client.id,
        title: client.name
      })).sort((a: any, b: any) => {
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
    }
  },

  methods: {
    formatDate(str: string | Date | undefined): string {
      if (!str) return ''
      const date = new Date(str)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    },
    async submitForm() {
      const { clientId, refNo, date, lineItems, notes, subtotal, tax, total } = this
      try {
        const response = await API.invoices.store({
          clientId: clientId,
          refNo,
          date,
          lineItems,
          notes,
          subtotal: parseFloat(subtotal).toFixed(2),
          tax: parseFloat(tax).toFixed(2),
          total: parseFloat(total).toFixed(2)
        })

        const { id } = response.data        
        this.$router.push({ name: 'Invoices/Show', params: { invoiceId: id }})
      } catch(e) {
        console.error(e)
      }
    }
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="title">New Invoice</h1>
      </v-col>
    </v-row>
    <v-form @submit.prevent="submitForm" validate-on="submit" v-if="!loading">
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
              hint="Reference number, can be anything you want"
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
          <Button color="transparent">
            <v-icon>mdi-close-circle</v-icon> Cancel
          </Button>
        </v-col>
      </v-row>
      
    </v-form>
  </v-container>
</template>

<style lang="scss" scoped>
.document {
  background-color: #ffffff;
  padding: 0.5cm;
}

:global(input.db__input) {
  border-radius: 0 !important;
  border: 1px solid #9A8F99 !important;
  height: 56px !important;
}
</style>