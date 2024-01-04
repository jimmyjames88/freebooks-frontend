<script lang="ts">
import { defineComponent } from 'vue';
import InvoiceStatus from './InvoiceStatus.vue'

export default defineComponent({
  name: 'InvoiceCard',
  components: { InvoiceStatus },
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
  <v-card v-else variant="flat" color="gray" :to="{ name: 'Invoices/Show', params: { invoiceId: id }}">
    <v-card-text>

      <v-row>
        <v-col>
          <h3 v-if="client">{{ client.name }}</h3>
          <h4 class="on-surface"># {{ refNo || '---' }}</h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-icon>mdi-calendar</v-icon> {{ date || 'January 1st, 2023' }}</v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col class="on-surface">
          <InvoiceStatus :status="status" /> 
        </v-col>
        <v-col align="end">
          <h2 class="text-tertiary">${{ total || ' ---' }}</h2>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
h3 {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>