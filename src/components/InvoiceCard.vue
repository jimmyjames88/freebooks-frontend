<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InvoiceCard',
  props: {
    _id: String,
    client: Object,
    ref: String,
    date: String,
    total: Number
  }
})
</script>

<template>
  <v-card variant="flat">
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