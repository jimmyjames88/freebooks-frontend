<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import { _Collection, _Invoice } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import AutoComplete from './AutoComplete.vue'
import Invoice from '@/classes/Invoice'

interface _SelectItem {
  value: number
  title: string
}

export default defineComponent({
  name: 'InvoiceSelect',
  inheritAttrs: false,
  components: { AutoComplete },
  emits: ['update:modelValue'],
  data: (): {
    invoices: _Invoice[]
  } => ({
    invoices: [],
  }),
  props: {
    ClientId: {
      type: Number,
      default: undefined
    },
    modelValue: {
      type: Number,
      default: undefined
    }
  },
  watch: {
    async 'ClientId'(to) {
      if (to) {
        try {
          const data: _Collection<Invoice> = await API.invoices.index({ ClientId: to })
          this.invoices = data.items
          if (this.$route.query.InvoiceId)
            this.value = Number(this.$route.query.InvoiceId)
        } catch(err: any) {
          console.warn(err)
        }
      } else {
        return this.invoices = []
      }
    }
  },
  computed: {
    value: {
      get(): number | undefined {
        return this.modelValue || undefined
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      }
    },
    invoiceList(): _SelectItem[] {
      return this.invoices.map((invoice: _Invoice) => ({
        value: invoice.id,
        title: `#${invoice.refNo} - $${invoice.total} - ${invoice.dueDate}`
      })).sort((a: _SelectItem, b: _SelectItem) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
        return 0
      })
    },
  }
})
</script>

<template>
  <AutoComplete 
    v-model="value"
    v-bind="$attrs"
    :items="invoiceList"
    label="Invoice" 
    variant="outlined" 
    prepend-inner-icon="mdi-receipt-text" 
    clearable 
  />
</template>