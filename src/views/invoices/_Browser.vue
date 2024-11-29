<script lang="ts">
import { defineComponent } from 'vue'
import { Button, DataTable } from '@/components'
import { formatCurrency, formatDateMMDDYYYY } from '@/utils'
import DataTableComposable from '@/composables/DataTable'
import API from '@/api'
import { Invoice } from '@/classes'

export default defineComponent({
  name: 'Invoices/_Browser',
  setup() {
    const { items, itemsLength, sortBy, loadItems, loading } = DataTableComposable(API.invoices.index)
    return { items, itemsLength, sortBy, loadItems, loading }
  },
  components: { Button, DataTable },
  data: (): {
    invoices: any[],
    headers: any[]
  } => ({
    invoices: [],
    headers: [{
      title: 'Date',
      align: 'start',
      sortable: true,
      key: 'date'
    },
    {
      title: 'Client',
      sortable: true,
      key: 'Client.name'
    },
    {
      title: 'Ref No',
      sortable: true,
      key: 'refNo'
    },
    {
      title: 'Total',
      sortable: true,
      key: 'total'
    }]
  }),
  computed: {
    formatCurrency: () => formatCurrency,
    formattedDate: () => formatDateMMDDYYYY
  },
  mounted() {
  },
  methods: {
    handleClick(_e: PointerEvent, row: any){
      this.$emit('select', new Invoice(row.item))
      this.close()
    },
    close() {
      this.$emit('close')
    }
  }
})
</script>

<template>
  <v-dialog :model-value="true" v-bind="$attrs" persistent width="1100">
    <v-card>
      <DataTable
        class="pa-4"
        :headers="headers"
        :sort-by="sortBy"
        :items="items"
        :items-length="itemsLength"
        @load-items="loadItems"
        :loading="loading"
        @click:row="handleClick"
      >
        <template #item.date="{ item }">
          {{ formattedDate(item.date) }}
        </template>
        <template #item.total="{ item }">
          {{ formatCurrency(item.total) }}
        </template>
      </DataTable>
      <v-card-actions>
        <v-spacer />
        <Button @click="close">Cancel</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>