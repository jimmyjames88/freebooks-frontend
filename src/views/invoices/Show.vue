<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import API from '@/api'
import { Avatar, Button, Header, InvoiceStatus, Spinner } from '@/components'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'

export default defineComponent({
  name: 'Invoices/Show',
  components: { Avatar, Button, Header, InvoiceStatus, Spinner },
  data: () => ({
    loading: true,
    id: null,
    lineItems: [] as {
      type: string,
      description: string,
      rate: number,
      quantity: number
    }[],
    notes: '',
    refNo: '',
    issueDate: null,
    dueDate: null,
    status: null,
    client: {
      id: null,
      name: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal: '',
        country: ''
      },
      phone: '',
      website: '',
    },
  }),
  computed: {
    headerTitle(): string {
      let title = this.$vuetify.display.mdAndUp ? '' : 'Invoice'
      title += this.refNo ? ` #${this.refNo}` : ''
      return title
    },
    subtotal(): string {
      const subtotal = this.lineItems.reduce((acc, item) => {
        return acc + (item.rate * item.quantity)
      }, 0)
      return subtotal.toFixed(2)
    },
    tax(): string {
      return (+this.subtotal * 0.05).toFixed(2)
    },
    total(): string {
      return (+this.subtotal + +this.tax).toFixed(2)
    },
    pastDue(): boolean {
      if (!this.dueDate) return false
      const dueDate = new Date(this.dueDate)
      const today = new Date()
      return dueDate < today
    }
  },
  mounted() {
    this.loading = true
    API.invoices.show(this.$route.params.invoiceId)
      .then((response: AxiosResponse) => {
        const { id, client, lineItems, notes, refNo, issueDate, dueDate, status } = response.data
        this.id = id
        this.client = client
        this.lineItems = lineItems
        this.notes = notes
        this.refNo = refNo
        this.issueDate = issueDate
        this.dueDate = dueDate
        this.status = status
      })
      .catch((err: Error) => console.warn(err))
      .finally(() => this.loading = false)
  },
  methods: {
    download() {
      console.log('downloading... todo')
    },
    print() {
      window.print()
    }
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <template v-else>
    <Header :title="headerTitle">
      <template #desktop>
        <Button color="primary" :to="{ name: 'Invoices/Edit', params: { invoiceId: id }}">
          <v-icon>mdi-receipt-text-edit</v-icon> Edit
        </Button>
        <Button color="primary" :disabled="!client.id">
          <v-icon>mdi-email</v-icon> {{ status === 'draft' ? 'Send' : 'Resend'  }}
        </Button>
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" color="transparent" icon flat>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="print">
              <v-icon>mdi-printer</v-icon> Print
            </v-list-item>
            <v-list-item @click="download" disabled>
              <v-icon>mdi-download</v-icon> Download
            </v-list-item>
            <v-list-item :to="{ name: 'Invoices/Delete', params: { invoiceId: id }}">
              <v-icon>mdi-delete</v-icon> Delete
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #mobile>
        <v-list>
          <v-list-item :to="{ name: 'Invoices/Edit', params: { invoiceId: id }}">
            <v-icon>mdi-receipt-text-edit</v-icon> Edit
          </v-list-item>
          <v-list-item>
            <v-icon>mdi-email</v-icon> {{ status === 'draft' ? 'Send' : 'Resend'  }}
          </v-list-item>
          <v-list-item @click="print">
            <v-icon>mdi-printer</v-icon> Print
          </v-list-item>
          <v-list-item @click="download" disabled>
            <v-icon>mdi-download</v-icon> Download
          </v-list-item>
          <v-list-item :to="{ name: 'Invoices/Delete', params: { invoiceId: id }}">
            <v-icon>mdi-delete</v-icon> Delete
          </v-list-item>
        </v-list>
      </template>
    </Header>
    <v-container>
      <div class="document pa-4 pa-sm-8">
        <v-row>
          <v-col>
            <h1 class="title">
              Invoice
              <InvoiceStatus :status="status" class="d-print-none" /> 
              <v-chip class="ml-1" color="primary" size="small">
                PAST DUE
              </v-chip><!-- TODO -->
            </h1>
            <h3># {{ refNo }}</h3>
          </v-col>
          <v-col align="end">
            <h3>Issued: {{ issueDate }}</h3>
            <h3>Pay by: {{ dueDate }}</h3>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12" md="6">
            <h2>FreeBooks</h2>
            <p>Address line 1</p>
            <p>Address line 2</p>
            <p>City, State, Postal</p>
            <p>Country</p>
          </v-col><!-- TODO -->
          <v-col cols="12" md="6">
            <div v-if="client">
              <h2>
                <router-link v-if="client.id" :to="{ name: 'Clients/Show', params: { clientId: client.id }}">
                  {{ client.name }}
                </router-link>
              </h2>
              <p>{{ client?.address?.line1 }}</p>
              <p>{{ client?.address?.line2 }}</p>
              <p>
                {{ client?.address?.city }},
                {{ client?.address?.state }}
                {{ client?.address?.postal }}
              </p>
              <p>{{ client?.address?.country }}</p>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-8" />
        <v-row class="line-item-headers">
          <v-col cols="12" sm="6">
            <h3>Description</h3>
          </v-col>
          <v-col cols="4" sm="2" align="center">
            <h3>Rate</h3>
          </v-col>
          <v-col cols="4" sm="2" align="center">
            <h3>Quantity</h3>
          </v-col>
          <v-col cols="4" sm="2" align="end">
            <h3>Total</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="line-items">
            <v-row v-for="(item, index) in lineItems" :key="`item-${index}`">
              <v-col cols="12" sm="6">{{ item.description }}</v-col>
              <v-col cols="4" sm="2" align="center">${{ item.rate }}</v-col>
              <v-col cols="4" sm="2" align="center">{{ item.quantity }}</v-col>
              <v-col cols="4" sm="2" align="end">${{ (item.quantity * item.rate).toFixed(2) }}</v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="mt-8 mb-4" />
        <v-row>
          <v-col>
            {{ notes }}
          </v-col>
          <v-col md="4">
            <v-row>
              <v-col>Subtotal</v-col>
              <v-col align="end">${{ subtotal }}</v-col>
            </v-row>
            <v-row>
              <v-col>Tax (5% GST)</v-col>
              <v-col align="end">${{ tax }}</v-col>
            </v-row>
            <v-row>
              <v-col>
                <h2>Total</h2>
              </v-col>
              <v-col align="end">
                <h2 class="text-secondary">${{ total }}</h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </template>
</template>