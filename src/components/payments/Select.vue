<script lang="ts">
import { defineComponent } from 'vue'
import { _PaymentType } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { AutoComplete } from '@/components'

interface _SelectItem {
  value: number
  title: string
}

export default defineComponent({
  name: 'Payments.Select',
  inheritAttrs: false,
  components: { AutoComplete },
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data: (): {
    paymentTypes: _PaymentType[]
  } => ({
    paymentTypes: [],
  }),
  mounted() {
    this.loadPaymentTypes()
  },
  computed: {
    value: {
      get(): number {
        return this.modelValue || undefined
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      }
    },
    paymentTypesVListItems(): _SelectItem[] {
      return this.paymentTypes.map((paymentType: _PaymentType) => ({
        value: Number(paymentType.id),
        title: paymentType.name
      })).sort((a: _SelectItem, b: _SelectItem) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
        return 0
      })
    },
  },
  methods: {
    async loadPaymentTypes() {
      try {
        const response = await API.payments.types()
        this.paymentTypes = response.data
      } catch(err: any) {
        console.warn(err)
      }
    },
  }
})
</script>

<template>
  <AutoComplete 
    v-model="value"
    v-bind="$attrs"
    :items="paymentTypesVListItems"
    label="Payment type" 
    variant="outlined" 
    prepend-inner-icon="mdi-hand-coin" 
    clearable 
  />
</template>