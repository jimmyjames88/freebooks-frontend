<script lang="ts">
import { defineComponent } from 'vue'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import API from '@/api'
import DataTableComposable from '../../composables/DataTable'
import { Avatar, Button, DataTable, InvoiceStatus } from '@/components'
import TextField from '../../components/TextField.vue'

export default defineComponent({
  name: 'Invoices/Index',
  components: { Avatar, Button, DataTable, InvoiceStatus, VSkeletonLoader, TextField },
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
      title: 'Date',
      sortable: true,
      key: 'date'
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
          :headers="headers"
          :sort-by="sortBy"
          :items="items"
          :items-length="itemsLength"
          @load-items="loadItems"
        >
          <template #item.refNo="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.selectable.id }}">
              # {{ item.selectable.refNo }}
            </router-link>
          </template>
          <template #item.client.name="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.selectable.id }}">
              <Avatar class="mr-4">{{ item.selectable.client.name }}</Avatar>
              {{ item.selectable.client.name }}
            </router-link>
          </template>
          <template #item.date="{ item }">
            {{ item.selectable.date }}
          </template>
          <template #item.status="{ item }">
            <InvoiceStatus :status="item.selectable.status" />
          </template>
          <template #item.total="{ item }">
            {{ item.selectable.total }}
          </template>
          <template #item.actions="{ item }">
            <v-btn flat size="xs">
              <v-icon>mdi-dots-vertical</v-icon>
              <v-menu activator="parent">
                <v-list>
                  <v-list-item :to="{ name: 'Invoices/Show', params: { invoiceId: item.selectable.id }}">
                    <v-list-item-title>View</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Invoices/Edit', params: { invoiceId: item.selectable.id }}">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item :to="{ name: 'Invoices/Delete', params: { invoiceId: item.selectable.id }}">
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