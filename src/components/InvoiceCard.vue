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
  <v-card v-else variant="flat">
    <v-card-text>
      <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: id }}">
        <v-row>
          <v-col>
            <h4># {{ refNo || '---' }}</h4>
          </v-col>
          <v-col align="end" class="pa-2 ma-0">
            <InvoiceStatus :status="status" />
          </v-col>
        </v-row>
      </router-link>
      <v-divider class="my-4" />
      <v-row>
        <v-col>
          {{ date || 'January 1st, 2023' }}
        </v-col>
        <v-col align="end">
          <h2>${{ total || ' ---' }}</h2>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>