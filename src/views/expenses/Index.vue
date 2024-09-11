<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice } from '@jimmyjames88/freebooks-types'
import DataTableComposable from '@/composables/DataTable'
import API from '@/api'
import { 
  AutoComplete, Avatar, Button, ClientSelect, DataTable, Header, Select, TextField
} from '@/components'
import ExpenseDialog from './_Dialog.vue'
import { formatDateMMDDYYYY } from '@/utils'


export default defineComponent({
  name: 'Expenses/Index',
  components: { 
    AutoComplete, Avatar, Button, ClientSelect, DataTable, Header, Select, ExpenseDialog, TextField
   },
  setup(){
    const { items, itemsLength, sortBy, loadItems, loading } = DataTableComposable(API.expenses.index)
    return { items, itemsLength, sortBy, loadItems, loading }
  },
  data: (): {
    showExpenseDialog: boolean,
    sortBy: any[],
    headers: any[]
  } => ({
    showExpenseDialog: false,
    sortBy: [{
      key: 'updatedAt',
      order: 'asc'
    }],
    headers: [{
      title: 'Date',
      align: 'start',
      sortable: true,
      key: 'date'
    },
    {
      title: 'Invoice',
      sortable: true,
      key: 'Invoice.refNo'
    },
    {
      title: 'Description',
      sortable: false,
      key: 'description'
    },
    {
      title: 'Subtotal',
      sortable: true,
      key: 'subtotal'
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
      // if (this.$vuetify.display.xs) {
      //   return this.headers.filter(header => {
      //     return [ 'invoice.refNo', 'name', 'amount' ].includes(header.key)
      //   })
      // } else if (this.$vuetify.display.sm) {
      //   return this.headers.filter(header => {
      //     return [ 'invoice.refNo', 'name', 'type', 'amount', 'actions' ].includes(header.key)
      //   })
      // }
      return this.headers
    }
  },
  methods: {
    formatDate: formatDateMMDDYYYY
  }
})
</script>

<template>
  <Header title="Expenses">
    <template #desktop>
      <Button color="primary" @click="showExpenseDialog = true">
        <v-icon>mdi-cash-minus</v-icon> Add Expense
      </Button>
    </template>
    <template #mobile>
      <v-list>
        <v-list-item prepend-icon="mdi-cash-plus" @click="showExpenseDialog = true">
          Add Expense
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
            <template v-if="item.Invoice?.id">
              <router-link :to="{ name: 'Invoices/Show', params: { InvoiceId: item.Invoice.id }}">
                #{{ item.Invoice.refNo }}
              </router-link>
            </template>
          </template>
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.subtotal="{ item }">
            ${{ item.subtotal.toFixed(2) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn flat size="xs">
              <v-icon>mdi-dots-vertical</v-icon>
              <v-menu activator="parent">
                <v-list>
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
  <ExpenseDialog v-if="showExpenseDialog" @close="showExpenseDialog = false" />
</template>