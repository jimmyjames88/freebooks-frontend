<script lang="ts">
import { defineComponent } from 'vue'
import { formatDateMMDDYYYY } from '@/utils'
import API from '@/api'
import DataTableComposable from '../../composables/DataTable'
import { Avatar, Button, DataTable, Header, InvoiceStatus, PastDue } from '@/components'
import TextField from '../../components/TextField.vue'

export default defineComponent({
  name: 'Invoices/Index',
  components: { Avatar, Button, DataTable, Header, InvoiceStatus, PastDue, TextField },
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
      title: 'Status',
      align: 'start',
      sortable: true,
      key: 'status'
    },
    {
      title: 'Ref',
      align: 'start',
      sortable: true,
      key: 'refNo'
    },
    {
      title: 'Client',
      sortable: true,
      key: 'client.name',
    },
    {
      title: 'Due by',
      sortable: true,
      key: 'dueDate',
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
    formattedDate: () => formatDateMMDDYYYY,
    responsiveHeaders() {
      if (this.$vuetify.display.xs) {
        return this.headers.filter(header => {
          return [ 'client.name', 'total' ].includes(header.key)
        })
      } else if (this.$vuetify.display.sm) {
        return this.headers.filter(header => {
          return [ 'client.name', 'dueDate', 'total' ].includes(header.key)
        })
      }
      return this.headers
    }
  },
})
</script>

<template>
  <Header title="Invoices">
    <template #desktop>
      <Button color="primary" :to="{ name: 'Invoices/Create' }">
        <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
      </Button>
    </template>
    <template #mobile>
      <v-list>
        <v-list-item :to="{ name: 'Invoices/Create' }" prepend-icon="mdi-receipt-text-plus">
          New Invoice
        </v-list-item>
      </v-list>
    </template>
  </Header>
  <!-- <v-row justify="start" align="center">
    <v-col>
      <h1 class="title">Invoices</h1>
    </v-col>
    <v-col align="end">
      <Button color="primary" :to="{ name: 'Invoices/Create' }">
        <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
      </Button>
    </v-col>
  </v-row> -->
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
          <template #item.status="{ item }">
            <InvoiceStatus :invoiceId="item.id"
              :modelValue="item.status"
              :dueDate="new Date(item.dueDate)"
              smallPD
            />
          </template>
          <template #item.refNo="{ item }">
            <div class="d-inline-flex align-center">
              <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
                # {{ item.refNo }}
              </router-link>
            </div>
          </template>
          <template #item.client.name="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: item.id }}">
              <Avatar :name="item.client?.name || undefined" class="mr-4 d-none d-sm-inline-flex" />
              <span v-if="item.client?.name">{{ item.client.name }}</span>
              <em v-else>- Unassigned -</em>
            </router-link>
          </template>
          <template #item.dueDate="{ item }">
            {{ formattedDate(item.dueDate) }}
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