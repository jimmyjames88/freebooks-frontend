<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import { Tax } from '@/classes'
import API from '@/api'

export default defineComponent({
  name: 'Taxes/TaxSelect',
  emits: ['update:modelValue'],
  props: ['modelValue'],
  data: (): {
    taxTotal: number
    taxList: Tax[]
  } => ({
    taxTotal: 0,
    taxList: []
  }),
  computed: {
    value: {
      get(): number[] {
        return this.modelValue
      },
      async set(ids: number[]) {
        this.$emit('update:modelValue', ids)
      }
    }
  },
  mounted() {
    this.loadTaxList()
  },
  methods: {
    async loadTaxList() {
      const response = await API.taxes.index()
      this.taxList = response.data.items.map((tax: _Tax) => new Tax(tax))
    }
  },
})
</script>

<template>
  <h2>Taxes</h2>
  <v-row>
    <v-col cols="12" md="4" v-for="(tax, index) in taxList" :key="index">
      <v-checkbox
        v-model="value"
        :label="tax.name"
        :value="tax.id"
        hide-details />
    </v-col>
  </v-row>
</template>