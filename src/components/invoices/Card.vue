<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _InvoiceStatus } from '@jimmyjames88/freebooks-types'
import { formatDateMMDDYYYY } from '@/utils'
import InvoiceStatus from './Status.vue'

export default defineComponent({
  name: 'Invoices.Card',
  components: { InvoiceStatus },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    id: Number,
    Client: Object,
    refNo: String,
    status: {
      type: String as PropType<_InvoiceStatus>,
      required: true
    },
    dueDate: {
      type: Date
    },
    total: Number
  },
  computed: {
    statusModel: {
      get() {
        return this.status
      },
      set(value: _InvoiceStatus) {
        this.$emit('update:status', value)
      }
    }
  },
  methods: {
    formatDate: formatDateMMDDYYYY
  }
})
</script>

<template>
  <v-skeleton-loader
    v-if="loading || !id"
    class="mx-auto"
    type="heading, divider, paragraph"
  />
  <v-card v-else variant="flat" color="gray">
    <v-card-text>
      <v-row>
        <v-col>
          <h3 v-if="Client">
            <router-link :to="{ name: 'Invoices/Show', params: { InvoiceId: id }}">
              {{ Client.name }}
            </router-link>
          </h3>
          <h4 class="on-surface">
            <router-link :to="{ name: 'Invoices/Show', params: { InvoiceId: id }}">
              # {{ refNo || '---' }}
            </router-link>
          </h4>
        </v-col>
        <v-col v-if="$slots.topright" align="end">
          <slot name="topright" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-icon>mdi-calendar</v-icon> {{ formatDate(dueDate) }}</v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-row>
        <v-col class="on-surface">
          <InvoiceStatus v-model="statusModel" :InvoiceId="id" :dueDate="dueDate" smallPD /> <!-- todo type-->
        </v-col>
        <v-col v-if="$slots.bottomright" align="end">
          <slot name="bottomright" />
        </v-col>
        <v-col v-else align="end">
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