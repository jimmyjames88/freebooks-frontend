<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import API from '@/api'
import Spinner from './Spinner.vue'

export default defineComponent({
  name: 'OutstandingRevenue',
  components: { Spinner },
  props: {},
  data: () => ({
    loading: true,
    revenue: 0,
    pastDue: 0
  }),
  computed: {
    percentagePastDue(): number {
      return Math.round((this.pastDue / this.revenue) * 100)
    }
  },
  async mounted() {
    await API.dashboard.outstandingRevenue()
      .then((response: AxiosResponse) => {
        const { revenue, pastDue } = response.data
        this.revenue = revenue
        this.pastDue = pastDue
      })
      .catch((error: any) => {
        console.error(error)
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    
  }
})
</script>

<template>
  <v-card flat>
    <v-card-text>
      <Spinner v-if="loading" />
      <template v-else>
        <v-row class="align-center">
          <v-col>
            <v-progress-linear
              :model-value="percentagePastDue"
              color="primary"
              bgColor="tertiary"
              bgOpacity="1"
              height="40"
              rounded 
            />
            <div class="d-flex mt-4">
              <h4>
                <v-icon color="primary" size="x-small">mdi-square</v-icon> Past due
              </h4>
            </div>
          </v-col>
          <v-col cols="12" sm="3" md="2">
            <h4>Outstanding</h4>
            <h2 class="text-tertiary">${{ revenue.toFixed(2) }}</h2>
            <v-divider class="my-4" />
            <h4>Past due</h4>
            <h2 class="text-primary">${{ pastDue.toFixed(2) }}</h2>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>