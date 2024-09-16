<script lang="ts">
import { defineComponent } from 'vue'
import { TextField } from '@/components'
import LineItem from './LineItem.vue'

export default defineComponent({
  name: 'Invoices.LineItems',
  components: { LineItem, TextField },
  props: [ 'LineItems' ],

  methods: {
    addItem(item = {
        type: '',
        description: '',
        rate: null,
        quantity: null
    }) {
      this.LineItems.push(item)
    },
    deleteItem(index: number) {
      this.LineItems.splice(index, 1)
      if (!this.LineItems.length) {
        this.addItem()
      }
    },

    handleBlur() {
      // If the last line item has a description, rate, or quantity, add a new line item
      const lastIndex = this.LineItems.length - 1
      const lastLine = this.LineItems[lastIndex]
      if (lastLine.description || lastLine.rate || lastLine.quantity) {
        this.addItem()
      }
    },
    
    handleEndOfLine(index: number) {
      const lastIndex = this.LineItems.length - 1
      const lastLine = this.LineItems[lastIndex]
      if (index === lastIndex && (lastLine.description || lastLine.rate || lastLine.quantity)) {
        this.addItem()
      }
    }
  }
})
</script>

<template>
  <div>
    <v-row class="d-none d-sm-flex line-item-headers">
      <v-col cols="6">
        <h3>Description</h3>
      </v-col>
      <v-col cols="2">
        <h3>Rate</h3>
      </v-col>
      <v-col cols="1">
        <h3>Qty</h3>
      </v-col>
      <v-col cols="2">
        <h3>Amount</h3>
      </v-col>
    </v-row>
    <LineItem v-for="(item, index) in LineItems"
      class="line-item"
      :key="`lineitem-${index}`"
      v-model:type="item.type"
      v-model:description="item.description"
      v-model:rate="item.rate"
      v-model:quantity="item.quantity"
      @delete="deleteItem(index)"
      @endOfLine="handleEndOfLine(index)"
      @blur="handleBlur"
    />
  </div>
</template>