<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice, _Payment, _PaymentType } from '@jimmyjames88/freebooks-types'
import DataTableComposable from '@/composables/DataTable'
import API from '@/api'
import { 
  AutoComplete, Avatar, Button, ClientSelect, DataTable, Header, Select, TextField
} from '@/components'
import PaymentDialog from './_Dialog.vue'


export default defineComponent({
  name: 'Payments/Index',
  components: { 
    AutoComplete, Avatar, Button, ClientSelect, DataTable, Header, Select, PaymentDialog, TextField
   },
  setup(){
    const { items, itemsLength, sortBy, loadItems, loading } = DataTableComposable(API.payments.index)
    return { items, itemsLength, sortBy, loadItems, loading }
  },
  data: (): {
    showPaymentDialog: boolean,
    sortBy: any[],
    headers: any[]
  } => ({
    showPaymentDialog: false,
    sortBy: [{
      key: 'updatedAt',
      order: 'asc'
    }],
    headers: [{
      title: 'Invoice',
      align: 'start',
      sortable: true,
      key: 'Invoice.refNo'
    },
    {
      title: 'Client',
      sortable: true,
      key: 'Client.name'
    },
    {
      title: 'Amount',
      sortable: true,
      key: 'amount'
    },
    {
      title: 'Type',
      sortable: true,
      key: 'type'
    },
    {
      title: 'Date',
      sortable: true,
      key: 'createdAt'
    },
    {
      title: 'Actions',
      align: 'end',
      key: 'actions',
      sortable: false
    }]
  }),
  computed: {
    responsiveHeaders() {
      if (this.$vuetify.display.xs) {
        return this.headers.filter(header => {
          return [ 'Invoice.refNo', 'name', 'amount' ].includes(header.key)
        })
      } else if (this.$vuetify.display.sm) {
        return this.headers.filter(header => {
          return [ 'Invoice.refNo', 'name', 'type', 'amount', 'actions' ].includes(header.key)
        })
      }
      return this.headers
    }
  }
})
</script>

<template>
  <Header title="Payments">
    <template #desktop>
      <Button color="primary" @click="showPaymentDialog = true">
        <v-icon>mdi-cash-plus</v-icon> Add Payment
      </Button>
    </template>
    <template #mobile>
      <v-list>
        <v-list-item prepend-icon="mdi-cash-plus" @click="showPaymentDialog = true">
          Add Payment
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
          <template #item.Invoice.refNo="{ item }">
            <router-link :to="{ name: 'Invoices/Show', params: { InvoiceId: item.Invoice.id }}">
              #{{ item.Invoice.refNo }}
            </router-link>
          </template>
          <template #item.Client.name="{ item }">
            <Avatar :name="item.Client.name" class="mr-4" />
            {{ item.Client.name }}
          </template>
          <template #item.amount="{ item }">
            ${{ item.amount }}
          </template>
          <template #item.type="{ item }">
            {{ item.type }}
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
  <PaymentDialog v-if="showPaymentDialog" @close="showPaymentDialog = false" />
</template>