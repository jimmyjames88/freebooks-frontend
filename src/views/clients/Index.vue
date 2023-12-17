<script lang="ts">
import { defineComponent } from 'vue'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import API from '@/api'
import { Avatar, Button, ClientCard, DataTable } from '@/components'
import { AxiosError, AxiosResponse } from 'axios'
import TextField from '../../components/TextField.vue'

export default defineComponent({
  name: 'Clients.Index',
  components: { Avatar, Button, ClientCard, DataTable, VSkeletonLoader, TextField },
  data: () => ({
    clients: [] as any[],
    loading: true,
    itemsLength: 0,
    sortBy: [{
      key: 'name',
      order: 'asc'
    }]
  }),
  computed: {
    headers: (): any[] => ([
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
    ])
  },
  
  methods: {
    loadItems(filters: any = undefined, search: string = '') {
      this.loading = true
      API.clients.index({ ...filters, search })
        .then((response: AxiosResponse) => {
          this.clients = response.data.clients
          this.itemsLength = response.data.total
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
        <DataTable
          :headers="headers"
          :items="clients"
          :sort-by="sortBy"
          :items-length="itemsLength"
          :loading="loading"
          @loadItems="loadItems"
        >
        <template #item.name="{ item }">
            <router-link :to="{ name: 'Clients/Show', params: { clientId: item.selectable.id }}">
              <Avatar class="mr-4">{{ item.selectable.name }}</Avatar>
              {{ item.selectable.name }}
            </router-link>
          </template>
          <template #item.actions="{ item }">
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
                  <v-list-item :to="{ name: 'Clients/Delete', params: { clientId: item.selectable.id }}">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </template>  
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>