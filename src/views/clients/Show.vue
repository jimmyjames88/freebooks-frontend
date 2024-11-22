<script lang="ts">
import { defineComponent } from 'vue';
import { Avatar, Button, Header, InvoiceCards, Spinner } from '@/components'
import { Client } from '@/classes'


export default defineComponent({
  name: 'Clients/Show',
  components: { Avatar, Button, Header, InvoiceCards, Spinner },
  data: (): {
    loading: boolean
    client: Client
  } => ({
    loading: true,
    client: new Client()
  }),

  async mounted() {
    this.loading = true
    const id = Number(this.$route.params.ClientId)
    await this.client.get(id, { include: 'Invoices' })
    this.loading = false
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <template v-else>
    <Header title="Client">
      <template #title>
        <h1>
          <span>{{ client.name }}</span>
          <Avatar :name="client.name" class="ml-4" />
        </h1>
      </template>
      <template #desktop>
        <Button color="primary" :to="{ name: 'Clients/Edit', params: { ClientId: client.id }}">
          <v-icon>mdi-account-edit</v-icon> Edit Client
        </Button>
      </template>
      <template #mobile>
        <v-list>
          <v-list-item :to="{ name: 'Clients/Edit', params: { ClientId: client.id }}" prepend-icon="mdi-account-edit">
            Edit Client
          </v-list-item>
        </v-list>
      </template>
    </Header>
    <v-container>
      <v-row class="d-md-none">
        <v-col class="d-flex align-center flex-column">
          <Avatar :name="client.name" jumbo />
          <h2 class="mt-4">{{ client.name }}</h2>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="12" md="6" lg="4" xl="3" class="text-center text-md-left">
          <h3>Contact</h3>
          <v-list bgColor="transparent" class="ml-n4">
            <v-list-item :href="`mailto:${client.email}`">
              <v-icon>mdi-email</v-icon>
              {{ client.email }}
            </v-list-item>
            <v-list-item :href="`tel:${client.phone}`">
              <v-icon>mdi-phone</v-icon>
              {{ client.phone }}
            </v-list-item>
            <v-list-item :href="client.website" target="_blank">
              <v-icon>mdi-link</v-icon>
              {{ client.website }}
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6" lg="4" xl="3" class="text-center text-md-left">
          <h3>Address</h3>
          <v-list bgColor="transparent" class="ml-n4">
            <v-list-item v-if="client.address">
              <p>{{ client.address.line1 }}</p>
              <p>{{ client.address.line2 }}</p>
              <p>{{ client.address.city }}, {{ client.address.state }}, {{ client.address.country }}</p>
              <p>{{ client.address.postal }}</p>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <h2>Recent Invoices</h2>
      <InvoiceCards :invoices="client.Invoices" />
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