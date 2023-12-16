<script lang="ts">
import { defineComponent } from 'vue';
import { AxiosResponse } from 'axios';
import API from '@/api'
import { Avatar, Button, InvoiceCard } from '@/components'


export default defineComponent({
  name: 'Client.Show',
  components: { Avatar, Button, InvoiceCard },
  data: () => ({
    loading: true,
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
    invoices: []
  }),

  mounted() {
    console.log(this.$route.params.clientId)
    API.clients.show(this.$route.params.clientId)
      .then((response: AxiosResponse) => {
        const { id, name, email, address, phone, website, invoices } = response.data
        this.id = id
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
        <h1>
          <Avatar>{{ name }}</Avatar>
          <span>{{ name }}</span>
        </h1>
      </v-col>
      <v-col align="end">
        <Button color="primary" :to="{ name: 'Invoices/Create', query: { clientId: id }}">
          <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
        </Button>
        <Button color="primary" disabled>
          <v-icon>mdi-file-document-plus</v-icon>New Estimate
        </Button>
        <Button icon color="transparent" flat size="small">
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item :to="{ name: 'Clients/Edit', params: { clientId: id }}">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ name: 'Clients/Delete', params: { clientId: id }}">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </Button>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <v-row>
      <v-col cols="12" md="6" lg="4" xl="3">
        <h3>Contact</h3>
        <v-list>
          <v-list-item :href="`mailto:${email}`">
            <v-icon>mdi-email</v-icon>
            {{ email }}
          </v-list-item>
          <v-list-item :href="`tel:${phone}`">
            <v-icon>mdi-phone</v-icon>
            {{ phone }}
          </v-list-item>
          <v-list-item :href="website" target="_blank">
            <v-icon>mdi-link</v-icon>
            {{ website }}
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="6" lg="4" xl="3">
        <h3>Address</h3>
        <v-list>
          <v-list-item>
            <p>{{ address.line1 }}</p>
            <p>{{ address.line2 }}</p>
            <p>{{ address.city }}, {{ address.state }}, {{ address.country }}</p>
            <p>{{ address.postal }}</p>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <h2>Invoices ({{  invoices.length  }})</h2>
    <v-row>
      <v-col v-for="invoice in invoices" :key="`invoice-${invoice.id}`" cols="12" sm="6" md="4" lg="3">
        <InvoiceCard v-bind="invoice" 
          :client="{ name }"
          :loading="loading"
          :hideName="true"
        />
      </v-col>
    </v-row>
    <v-divider class="my-4" />
  </v-container>
</template>