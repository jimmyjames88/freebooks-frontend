<script lang="ts">
import { defineComponent } from 'vue'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import API from '@/api'
import { Button, ClientCard } from '@/components'
import { AxiosError, AxiosResponse } from 'axios'

export default defineComponent({
  name: 'Clients.Index',
  components: { Button, ClientCard, VSkeletonLoader },
  data: () => ({
    clients: [] as any[],
    loading: true
  }),
  mounted() {
    API.clients.index().then((response: AxiosResponse) => {
      this.clients = response.data
    }).catch((err: AxiosError) => {
      console.warn(err)
    }).finally(() => {
      this.loading = false
    })
  },
  
  methods: {
    deleteClient(clientId: string) {
      this.clients = this.clients.filter(client => client._id !== clientId)
    }
  }
})
</script>

<template>
  <v-container>
    <v-row justify="start" align="center">
      <v-col>
        <h1 class="title">Clients</h1>
      </v-col>
      <v-col align="end">
        <Button color="transparent" disabled>
          <v-icon>mdi-magnify</v-icon> Search
        </Button>
        <Button color="primary" :to="{ name: 'Clients/Create' }">
          <v-icon>mdi-account-plus</v-icon> Add Client
        </Button>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="client in clients" :key="`client-${client._id}`" cols="12" md="6" lg="4">
        <v-skeleton-loader
          v-if="loading"
          class="mx-auto border"
          type="avatar, heading, article"
        />
        <ClientCard v-else v-bind="client" @delete="deleteClient(client._id)"></ClientCard>
      </v-col>
    </v-row>
  </v-container>
</template>