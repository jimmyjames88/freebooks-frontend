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
    const { items, itemsLength, sortBy, loadItems, loading } = DataTableComposable(API.invoices.index)
    return { items, itemsLength, sortBy, loadItems, loading }
  },
  data: () => ({
    sortBy: [{
      key: 'updatedAt',
      order: 'desc'
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
      key: 'client.name',
      mobile: true
    },
    {
      title: 'Issued',
      sortable: true,
      key: 'issueDate',
      mobile: true
    },
    {
      title: 'Status',
      sortable: true,
      key: 'status',
      mobile: true
    },
    {
      title: 'Total',
      sortable: true,
      align: 'end',
      key: 'total',
    },
    {
      align: 'end',
      key: 'actions',
      sortable: false 
    }]
  }),
  computed: {
    responsiveHeaders() {
      if (this.$vuetify.display.smAndDown)
        return this.headers.filter(header => header.mobile)
      return this.headers
    }
  }
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
          :headers="responsiveHeaders"
          :sort-by="sortBy"
          :items="items"
          :items-length="itemsLength"
          @load-items="loadItems"
          :loading="loading"
        >
          <template #item.refNo="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
              # {{ item.refNo }}
            </router-link>
          </template>
          <template #item.client.name="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
              <Avatar :name="item.client?.name || undefined" class="mr-4 d-none d-md-inline-flex" />
              <span v-if="item.client?.name">{{ item.client.name }}</span>
              <em v-else>- Unassigned -</em>
            </router-link>
          </template>
          <template #item.date="{ item }">
            {{ item.date }}
          </template>
          <template #item.status="{ item }">
            <InvoiceStatus :status="item.status" />
          </template>
          <template #item.total="{ item }">
            ${{ item.total.toFixed(2) }}
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