<script lang="ts">
import { defineComponent } from 'vue'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import API from '@/api'
import { Avatar, Button, ClientCard } from '@/components'
import { AxiosError, AxiosResponse } from 'axios'
import TextField from '../../components/TextField.vue'

export default defineComponent({
  name: 'Clients.Index',
  components: { Avatar, Button, ClientCard, VDataTableServer, VSkeletonLoader, TextField },
  data: () => ({
    clients: [] as any[],
    itemsPerPage: 10,
    loading: true,
    totalItems: 0,
    search: '',
    searchTrigger: ''
  }),
  computed: {
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
        key: 'actions',
        sortable: false
      }
    ]),
    initials: (str: string) => initials(str)
  },
  
  methods: {
    deleteClient(clientId: string) {
      this.clients = this.clients.filter(client => client.id !== clientId)
    },
    triggerSearch() {
      if (!this.search || this.search.length > 2) {
        this.searchTrigger = Date.now().toString()
      }
    },
    loadItems(filters: any = undefined) {
      this.loading = true
      API.clients.index({ ...filters, search: this.search })
        .then((response: AxiosResponse) => {
          this.clients = response.data.clients
          this.totalItems = response.data.total
        }).catch((err: AxiosError) => {
          console.warn(err)
        }).finally(() => {
          this.loading = false
        })
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
        <Button color="primary" :to="{ name: 'Clients/Create' }">
          <v-icon>mdi-account-plus</v-icon> Add Client
        </Button>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :search="searchTrigger"
          :headers="headers"
          :items-length="totalItems"
          :items="clients"
          :loading="loading"  
          class="elevation-1"
          item-value="name"
          @update:options="loadItems"
        >
          <template v-slot:top>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <TextField
                    ref="search"
                    variant="outlined"
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    clearable
                    clear-icon="mdi-close"
                    single-line
                    hide-details
                    placeholder="Search"
                    @keypress.enter="triggerSearch"
                    @click:clear="triggerSearch"
                    @click:prepend-inner="triggerSearch"
                  ></TextField>
                </v-col>
              </v-row>
            </v-container>
          </template>
          
          <template v-slot:item.name="{ item }">
            <router-link :to="{ name: 'Clients/Show', params: { clientId: item.selectable.id }}">
              <Avatar>{{ item.selectable.name }}</Avatar>
              {{ item.selectable.name }}
            </router-link>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn flat size="xs">
              <v-icon>mdi-dots-vertical</v-icon>
              <v-menu activator="parent">
                <v-list>
                  <v-list-item>
                    <v-list-item-title>New Invoice</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>New Estimate</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Clients/Show', params: { clientId: item.selectable.id }}">
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Clients/Edit', params: { clientId: item.selectable.id }}">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Delete</v-list-item-title>
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