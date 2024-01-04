<script lang="ts">
import { defineComponent } from 'vue'
import { _Invoice } from '@jimmyjames88/freebooks-types'
import InvoiceCard from './InvoiceCard.vue'

export default defineComponent({
  name: 'Cards',
  components: { InvoiceCard },
  props: {
    cols: {
      type: Number,
      default: 12
    },
    sm: {
      type: Number,
      default: 4
    },
    md: {
      type: Number,
      default: 3
    },
    lg: {
      type: Number,
      default: 3
    },
    invoices: {
      type: Array as () => _Invoice[],
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
      <InvoiceCard v-bind="invoice" />
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