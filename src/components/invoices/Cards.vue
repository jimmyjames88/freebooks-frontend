<script lang="ts">
import { defineComponent } from 'vue'
import { Invoice } from '@/classes'
import InvoiceCard from './Card.vue'

export default defineComponent({
  name: 'Invoices.Cards',
  components: { InvoiceCard },
  props: {
    cols: {
      type: Number,
      default: 12
    },
    sm: {
      type: Number,
      default: 6
    },
    md: {
      type: Number,
      default: 4
    },
    lg: {
      type: Number,
      default: 3
    },
    invoices: {
      type: Array as () => Invoice[],
      default: () => []
    },
    showMoreText: {
      type: String,
      default: 'Show more'
    },
    showMoreTo: {
      type: [String, Object],
      default: () => ({ name: 'Invoices/Index' })
    }
  },
  data: () => ({
    
  }),
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    
  }
})
</script>

<template>
  <v-row>
    <v-col v-for="invoice in invoices"
      :key="`invoice-${invoice.id}`"
      :cols="cols"
      :sm="sm"
      :md="md"
      :lg="lg">
      <InvoiceCard :id="invoice.id"
        :client="invoice.Client"
        :refNo="invoice.refNo"
        :status="invoice.status"
        :dueDate="invoice.dueDate"
        :total="invoice.total"  
      />
    </v-col>
    <v-col v-if="showMoreText || showMoreTo" :cols="cols" :sm="sm" :md="md" :lg="lg">
      <v-card variant="flat" class="h-100 d-flex align-center justify-center" :to="showMoreTo">
        <v-card-text align="center">
          <h3>{{ showMoreText }}</h3>
        </v-card-text>  
      </v-card>
    </v-col>
  </v-row>
</template>