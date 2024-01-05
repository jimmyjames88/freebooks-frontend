<script lang="ts">
import { defineComponent } from 'vue'
import { OutstandingRevenue, PastDueInvoices } from '@/components'

export default defineComponent({
  name: 'Dashboard',
  components: { OutstandingRevenue, PastDueInvoices }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Dashboard</h1>
      </v-col>
    </v-row>
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