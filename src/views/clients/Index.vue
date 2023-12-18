<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import DataTableComposable from '../../composables/DataTable'
import { Avatar, Button, DataTable } from '@/components'
import TextField from '../../components/TextField.vue'

export default defineComponent({
  name: 'Clients/Index',
  components: { Avatar, Button, DataTable, TextField },
  setup(){
    const { items, itemsLength, sortBy, loadItems } = DataTableComposable(API.clients.index)
    return { items, itemsLength, sortBy, loadItems }
  },
  data: () => ({
    sortBy: [{
      key: 'updatedAt',
      order: 'asc'
    }],
    headers: [{
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
      align: 'end',
      key: 'actions',
      sortable: false
    }]
  }),
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
          class="pa-4"
          :headers="headers"
          :sort-by="sortBy"
          :items="items"
          :items-length="itemsLength"
          @load-items="loadItems"
        >
        <template #item.name="{ item }">
            <router-link :to="{ name: 'Clients/Show', params: { clientId: item.id }}">
              <Avatar class="mr-4">{{ item.name }}</Avatar>
              {{ item.name }}
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
                  <v-list-item :to="{ name: 'Clients/Show', params: { clientId: item.id }}">
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Clients/Edit', params: { clientId: item.id }}">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Clients/Delete', params: { clientId: item.id }}">
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