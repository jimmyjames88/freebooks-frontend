<script lang="ts">
import { defineComponent } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { Button, LineItems, Select, TextArea, TextField } from '@/components'
import API from '@/api'


export default defineComponent({
  name: 'Invoices/Create',
  components: { Button, LineItems, Select, TextArea, TextField, VueDatePicker },
  data: () => ({
    clients: [],
    clientId: null,
    ref: '',
    date: undefined,
    lineItems: [
      { type: '', description: '', rate: null, quantity: null }
    ],
    notes: ''
  }),

  async mounted() {
    const response = await API.clients.list()
    if (response.status === 200)
      this.clients = response.data
  },

  computed: {
    clientList(): any {
      return this.clients.map((client: any) => ({
        value: client._id,
        title: client.name
      })).sort((a: any, b: any) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
        return 0
      })
    },
    subtotal(): string {
      const sub = this.lineItems.reduce((acc, lineItem) => {
        const rate = parseFloat(lineItem.rate || '0.00')
        const quantity = parseFloat(lineItem.quantity || '0.00')
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
    async submitForm() {
      const { clientId, ref, date, lineItems, notes, subtotal, tax, total } = this
      try {
        await API.invoices.store({
          clientId: clientId,
          ref,
          date,
          lineItems,
          notes,
          subtotal: parseFloat(subtotal).toFixed(2),
          tax: parseFloat(tax).toFixed(2),
          total: parseFloat(total).toFixed(2)
        })
        
        this.$router.push({ name: 'Invoices' })
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
    <v-form @submit.prevent="submitForm" validate-on="submit">
      <div class="document">
        <v-row>
          <v-col sm="6" md="4">
            <Select v-model="clientId" :items="clientList" label="Client" variant="outlined" />
            <router-link :to="{ name: 'Clients/Create' }">
              <v-icon size="xsmall">mdi-account-plus</v-icon> Add Client
            </router-link>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <TextField v-model="ref" label="Ref #" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4" class="datepicker-col">
            <VueDatePicker v-model="date" label="Issue Date" />
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col>
            <h3>Line items</h3>
            <LineItems v-model:lineItems="lineItems"/>
          </v-col>
        </v-row>
        <v-divider class="mb-8" />
        <v-row>
          <v-col :cols="6">
            <TextArea v-model="notes" label="Notes" variant="outlined" />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-row>
              <v-col cols="6">Subtotal</v-col>
              <v-col cols="6">${{ subtotal }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Tax</v-col>
              <v-col cols="6">${{ tax }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Total</v-col>
              <v-col cols="6">${{ total }}</v-col>
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