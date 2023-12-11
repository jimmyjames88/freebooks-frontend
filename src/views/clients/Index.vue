<script lang="ts">
import { defineComponent } from 'vue'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import API from '@/api'
import { Button, ClientCard } from '@/components'
import { AxiosError, AxiosResponse } from 'axios'

export default defineComponent({
  name: 'Clients.Index',
  components: { Button, ClientCard, VDataTableServer, VSkeletonLoader },
  data: () => ({
    clients: [] as any[],
    itemsPerPage: 10,
    loading: true,
    totalItems: 100
  }),
  computed: {
    actions: () => ([
      { title: 'Edit' },
      { title: 'Delete' }
    ]),
    headers: () => ([
      {
        title: 'Name',
        align: 'start',
        sortable: true,
        key: 'name'
      },
      {
        title: 'Email',
        sortable: true,
        key: 'email'
      },
      {
        title: 'Actions',
        align: 'end',
        key: 'actions'
      }
    ])
  },
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
      this.clients = this.clients.filter(client => client.id !== clientId)
    },
    search() {
      // ...
    },
    loadItems() {}
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
      <v-col>
        <!-- <v-skeleton-loader
          v-if="loading"
          class="mx-auto"
          type="avatar, heading, article"
        />
        <ClientCard v-else v-bind="client" @delete="deleteClient(client.id)"></ClientCard> -->
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items-length="totalItems"
          :items="clients"
          :loading="loading"
          
          class="elevation-1"
          item-value="name"
          @update:options="loadItems"
        >
          <template v-slot:item.name="{ item }">
            <router-link :to="{ name: 'Clients/Show', params: { clientId: item.selectable.id }}">
              {{ item.selectable.name }}
            </router-link>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn flat size="xs">
              <v-icon>mdi-dots-vertical</v-icon>
              <v-menu activator="parent">
                <v-list>
                  <v-list-item v-for="(item, index) in actions"
                    :key="index"
                    :value="index"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </template>
        </v-data-table-server>  
      </v-col>
    </v-row>
  </v-container>
</template>