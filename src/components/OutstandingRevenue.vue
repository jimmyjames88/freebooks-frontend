<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'

export default defineComponent({
  name: 'OutstandingRevenue',
  components: {},
  props: {},
  data: () => ({
    revenue: 0,
    overdue: 0
  }),
  computed: {
    percentagePastDue(): number {
      return Math.round((this.overdue / this.revenue) * 100)
    }
  },
  async mounted() {
    const response = await API.dashboard.outstandingRevenue()
    const { revenue, overdue } = response.data
    this.revenue = revenue
    this.overdue = overdue
  },
  methods: {
    
  }
})
</script>

<template>
  <v-card flat>
    <v-card-text>
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
              <v-icon color="primary" size="x-small">mdi-square</v-icon> Overdue
            </h4>
          </div>
        </v-col>
        <v-col cols="12" sm="3" md="2">
          <h4>Outstanding</h4>
          <h2 class="text-tertiary">${{ revenue }}</h2>
          <v-divider class="my-4" />
          <h4>Overdue</h4>
          <h2 class="text-primary">${{ overdue }}</h2>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>