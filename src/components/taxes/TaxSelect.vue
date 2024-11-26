<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import { Tax } from '@/classes'
import API from '@/api'

export default defineComponent({
  name: 'Taxes/TaxSelect',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Array as PropType<Tax[]>,
      required: true
    }
  },
  data: (): {
    taxTotal: number
    taxList: Tax[]
    taxSelected: string[]
  } => ({
    taxTotal: 0,
    taxList: [],
    taxSelected: []
  }),
  computed: {
    value: {
      get(): any {
        return this.modelValue
      },
      async set() {
        this.$emit('update:modelValue', this.realTaxes)
      }
    },
    taxItems() {
      return this.taxList.map(tax => this.taxLabel(tax))
    },
    realTaxes() {
      return this.taxList.filter(tax => this.taxSelected.includes(this.taxLabel(tax)))
    }
  },
  mounted() {
    this.loadTaxList()
  },
  methods: {
    stringMatchTaxes(labels: string[]) {
      // set selected taxes based on labels
      console.log('emitting...', this.taxList.filter(tax => labels.includes(this.taxLabel(tax))))
      this.$emit(
        'update:modelValue',
        this.taxList.filter(tax => labels.includes(this.taxLabel(tax)))
      )
    },
    async loadTaxList() {
      const response = await API.taxes.index()
      this.taxList = response.data.items.map((tax: _Tax) => new Tax(tax))
      this.taxSelected = this.modelValue.map(tax => this.taxLabel(tax))
    },
    // todo - duplicated in _Form.vue
    taxLabel(tax: Tax) {
      return tax.type === _TaxType.PERCENTAGE
        ? `${tax.name} (${tax.rate}%)`
        : `${tax.name} ($${tax.rate})`
    }
  },
})
</script>

<template>
  <v-select
    v-model="taxSelected"
    :items="taxItems"
    multiple
    variant="outlined"
    chips
    closable-chips
    @update:model-value="stringMatchTaxes"      
  >
  </v-select>
</template>

<style lang="scss" scoped>
.v-input {
  &:deep(.v-field) {
    border-radius: 0;
  }
  &:deep(.v-input__control) {
    background-color: #ffffff;
  }
}
</style>