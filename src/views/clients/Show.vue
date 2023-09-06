<script lang="ts">
import { defineComponent } from 'vue';
import { AxiosResponse } from 'axios';
import API from '@/api'
import { Button, InvoiceCard } from '@/components'


export default defineComponent({
  name: 'Client.Show',
  components: { Button, InvoiceCard },
  data: () => ({
    loading: true,
    name: '',
    email: '',
    address: '',
    phone: '',
    website: '',
    invoices: []
  }),
  mounted() {
    console.log(this.$route.params.clientId)
    API.clients.show(this.$route.params.clientId)
      .then((response: AxiosResponse) => {
        const { name, email, address, phone, website, invoices } = response.data
        this.name = name
        this.email = email
        this.address = address
        this.phone = phone
        this.website = website
        this.invoices = invoices
      })
      .catch((err: Error) => console.warn(err))
      .finally(() => { 
        this.loading = false
      })
  }
})
</script>

<template>
  <v-container>
    <v-row justify="start" align="center">
      <v-col>
        <h1 v-text="name" />
      </v-col>
      <v-col align="end">
        <Button color="primary">
          <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
        </Button>
        <Button color="primary" disabled>
          <v-icon>mdi-file-document-plus</v-icon>New Estimate
        </Button>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <v-row>
      <v-col>
        <h3>Contact</h3>
        <v-icon>mdi-email</v-icon> {{ email }}<br />
        <v-icon>mdi-phone</v-icon> {{ phone }}<br />
        <v-icon>mdi-link</v-icon> {{ website }}
      </v-col>
      <v-col>
        <h3>Address</h3>
        {{ address.line1 }}<br />
        {{ address.line2 }}<br />
        {{ address.city }}, {{ address.province }}, {{ address.country }}<br />
        {{ address.postal }}
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <h2>Invoices ({{  invoices.length  }})</h2>
    <v-row>
      <v-col v-for="invoice in invoices" :key="`invoice-${invoice._id}`" cols="12" sm="6" md="4" lg="3">
        <InvoiceCard v-bind="invoice" :client="{ name }" :loading="loading" />
      </v-col>
    </v-row>
    <v-divider class="my-4" />
  </v-container>
</template>