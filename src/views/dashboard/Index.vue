<script lang="ts">
import { defineComponent } from 'vue'
import { Header } from '@/components'
import PastDueInvoices from './PastDueInvoices.vue'
import OutstandingRevenue from './OutstandingRevenue.vue'

export default defineComponent({
  name: 'Dashboard',
  components: { Header, PastDueInvoices, OutstandingRevenue }
})
</script>

<template>
  <Header title="Dashboard" />
  <v-container>
    <v-row>
      <v-col>
        <h2>Outstanding revenue</h2>
        <OutstandingRevenue />
      </v-col>
    </v-row>
    <v-divider class="my-8" />
    <v-row>
      <v-col>
        <PastDueInvoices />
      </v-col>
    </v-row>
  </v-container>
</template>