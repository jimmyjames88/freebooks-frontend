<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import DataTableComposable from '../../composables/DataTable'
import { Avatar, Button, DataTable, InvoiceStatus } from '@/components'
import TextField from '../../components/TextField.vue'

export default defineComponent({
  name: 'Invoices/Index',
  components: { Avatar, Button, DataTable, InvoiceStatus, TextField },
  setup(){
    const { items, itemsLength, sortBy, loadItems } = DataTableComposable(API.invoices.index)
    return { items, itemsLength, sortBy, loadItems }
  },
  data: () => ({
    sortBy: [{
      key: 'updatedAt',
      order: 'asc'
    }],
    headers: [{
      title: 'Ref',
      align: 'start',
      sortable: true,
      key: 'refNo'
    },
    {
      title: 'Client',
      sortable: true,
      key: 'client.name'
    },
    {
      title: 'Issued',
      sortable: true,
      key: 'issueDate'
    },
    {
      title: 'Status',
      key: 'status'
    },
    {
      title: 'Total',
      align: 'end',
      key: 'total',
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
        <h1 class="title">Invoices</h1>
      </v-col>
      <v-col align="end">
        <Button color="primary" :to="{ name: 'Invoices/Create' }">
          <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
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
          <template #item.refNo="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
              # {{ item.refNo }}
            </router-link>
          </template>
          <template #item.client.name="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
              <Avatar class="mr-4">{{ item.client.name }}</Avatar>
              {{ item.client.name }}
            </router-link>
          </template>
          <template #item.date="{ item }">
            {{ item.date }}
          </template>
          <template #item.status="{ item }">
            <InvoiceStatus :status="item.status" />
          </template>
          <template #item.total="{ item }">
            {{ item.total }}
          </template>
          <template #item.actions="{ item }">
            <v-btn flat size="xs">
              <v-icon>mdi-dots-vertical</v-icon>
              <v-menu activator="parent">
                <v-list>
                  <v-list-item :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Invoices/Edit', params: { invoiceId: item.id }}">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Invoices/Delete', params: { invoiceId: item.id }}">
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