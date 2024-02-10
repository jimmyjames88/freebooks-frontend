<script lang="ts">
import { defineComponent } from 'vue';
import API from '@/api'
import { Avatar, Button, Header, InvoiceCards, Spinner } from '@/components'
import Client from '@/classes/Client'


export default defineComponent({
  name: 'Clients/Show',
  components: { Avatar, Button, Header, InvoiceCards, Spinner },
  data: (): {
    loading: boolean
    Client: Client
  } => ({
    loading: true,
    Client: {
      id: null,
      Invoices: [],
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
      website: ''
    }
  }),

  async mounted() {
    this.loading = true
    this.Client = await API.clients.show(Number(this.$route.params.ClientId))
    this.loading = false
    // API.clients.show(Number(this.$route.params.ClientId))
    //   .then((response: AxiosResponse) => {
    //     const { id, name, email, address, phone, website, invoices } = response.data
    //     this.id = id
    //     this.name = name
    //     this.email = email
    //     this.address = address
    //     this.phone = phone
    //     this.website = website
    //     this.invoices = invoices.map((invoice: any) => {
    //       invoice.issueDate = new Date(invoice.issueDate)
    //       invoice.dueDate = new Date(invoice.dueDate)
    //       return invoice
    //     })
    //   })
    //   .catch((err: Error) => console.warn(err))
    //   .finally(() => { 
    //     this.loading = false
    //   })
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <template v-else>
    <Header title="Client">
      <template #title>
        <h1>
          <span>{{ Client.name }}</span>
          <Avatar :name="Client.name" class="ml-4" />
        </h1>
      </template>
      <template #desktop>
        <Button color="primary" :to="{ name: 'Clients/Edit', params: { ClientId: Client.id }}">
          <v-icon>mdi-account-edit</v-icon> Edit Client
        </Button>
      </template>
      <template #mobile>
        <v-list>
          <v-list-item :to="{ name: 'Clients/Edit', params: { ClientId: Client.id }}" prepend-icon="mdi-account-edit">
            Edit Client
          </v-list-item>
        </v-list>
      </template>
    </Header>
    <v-container>
      <v-row class="d-md-none">
        <v-col class="d-flex align-center flex-column">
          <Avatar :name="Client.name" jumbo />
          <h2 class="mt-4">{{ Client.name }}</h2>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="12" md="6" lg="4" xl="3" class="text-center text-md-left">
          <h3>Contact</h3>
          <v-list bgColor="transparent" class="ml-n4">
            <v-list-item :href="`mailto:${Client.email}`">
              <v-icon>mdi-email</v-icon>
              {{ Client.email }}
            </v-list-item>
            <v-list-item :href="`tel:${Client.phone}`">
              <v-icon>mdi-phone</v-icon>
              {{ Client.phone }}
            </v-list-item>
            <v-list-item :href="Client.website" target="_blank">
              <v-icon>mdi-link</v-icon>
              {{ Client.website }}
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6" lg="4" xl="3" class="text-center text-md-left">
          <h3>Address</h3>
          <v-list bgColor="transparent" class="ml-n4">
            <v-list-item v-if="Client.address">
              <p>{{ Client.address.line1 }}</p>
              <p>{{ Client.address.line2 }}</p>
              <p>{{ Client.address.city }}, {{ Client.address.state }}, {{ Client.address.country }}</p>
              <p>{{ Client.address.postal }}</p>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <h2>Recent Invoices</h2>
      <InvoiceCards :invoices="Client.Invoices" />
      <v-divider class="my-4" />
      <!-- <h2>Recent Estimates</h2>
      <v-row>
        <v-col v-for="invoice in invoices" :key="`invoice-${invoice.id}`" cols="12" sm="6" md="3">
          <InvoiceCard v-bind="invoice" 
            :client="{ name }"
            :loading="loading"
            :hideName="true"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-card variant="flat" class="h-100 d-flex align-center justify-center" to="#">
            <h3>View all Estimates</h3>
          </v-card>
        </v-col>
      </v-row> -->
    </v-container>
  </template>
</template>