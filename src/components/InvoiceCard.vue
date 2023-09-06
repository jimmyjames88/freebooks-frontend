<script lang="ts">
import { defineComponent } from 'vue';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

export default defineComponent({
  name: 'InvoiceCard',
  components: { VSkeletonLoader },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    _id: String,
    client: Object,
    ref: String,
    date: String,
    total: Number
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
      <router-link :to="{ name: 'Invoices/Show', params: { invoiceId: _id }}">
        <v-row>
          <v-col>
            <h3>{{ client?.name }}</h3>
          </v-col>
          <v-col align="end">
            <h4>#{{ ref || ' ---' }}</h4>
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