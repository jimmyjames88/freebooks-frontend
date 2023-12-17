<script lang="ts">
import { defineComponent } from 'vue';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import InvoiceStatus from './InvoiceStatus.vue'

export default defineComponent({
  name: 'InvoiceCard',
  components: { InvoiceStatus, VSkeletonLoader },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    id: Number,
    client: Object,
    refNo: String,
    status: String,
    date: String,
    total: Number,
    hideName: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<template>
  <v-skeleton-loader
    v-if="loading"
    class="mx-auto"
    type="heading, divider, paragraph"
  />
  <v-card v-else variant="flat" color="gray" :to="{ name: 'Invoices/Show', params: { invoiceId: id }}">
    <v-card-text>
      <v-row>
        <v-col>
          <h4 class="on-surface"># {{ refNo || '---' }}</h4>
        </v-col>
        <v-col align="end" class="pa-2 ma-0">
          <InvoiceStatus :status="status" />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col class="on-surface">
          {{ date || 'January 1st, 2023' }}
        </v-col>
        <v-col align="end">
          <h2 class="text-tertiary">${{ total || ' ---' }}</h2>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>