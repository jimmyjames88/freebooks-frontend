<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import DataTableComposable from '@/composables/DataTable'
import { Avatar, Button, DataTable, Header, TextField } from '@/components'

export default defineComponent({
  name: 'Clients/Index',
  components: { Avatar, Button, DataTable, Header, TextField },
  setup(){
    const { items, itemsLength, sortBy, loadItems, loading } = DataTableComposable(API.clients.index)
    return { items, itemsLength, sortBy, loadItems, loading }
  },
  data: (): {
    empty: boolean,
    sortBy: { key: string, order: string }[],
    headers: { title?: string, align?: string, sortable?: boolean, key: string }[]
  } => ({
    empty: false,
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
  computed: {
    responsiveHeaders() {
      if (this.$vuetify.display.xs) {
        return this.headers.filter(header => {
          return [ 'name' ].includes(header.key)
        })
      } else if (this.$vuetify.display.sm) {
        return this.headers.filter(header => {
          return [ 'name', 'email', 'actions' ].includes(header.key)
        })
      }
      return this.headers
    }
  }
})
</script>

<template>
  <Header title="Clients">
    <template #desktop>
      <Button color="primary" :to="{ name: 'Clients/Create' }">
        <v-icon>mdi-account-plus</v-icon> Add Client
      </Button>
    </template>
    <template #mobile>
      <v-list>
        <v-list-item :to="{ name: 'Clients/Create' }" prepend-icon="mdi-account-plus">
          Add Client
        </v-list-item>
      </v-list>
    </template>
  </Header>
  <v-container>
    <v-row>
      <v-col>
        <DataTable
          class="pa-4"
          :headers="responsiveHeaders"
          :sort-by="sortBy"
          :items="items"
          :items-length="itemsLength"
          @load-items="loadItems"
          :loading="loading"
        >
        <template #item.name="{ item }">
            <router-link :to="{ name: 'Clients/Show', params: { ClientId: item.id }}">
              <Avatar :name="item.name" class="mr-4" />
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
                  <v-list-item :to="{ name: 'Clients/Show', params: { ClientId: item.id }}">
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Clients/Edit', params: { ClientId: item.id }}">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Clients/Delete', params: { ClientId: item.id }}">
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