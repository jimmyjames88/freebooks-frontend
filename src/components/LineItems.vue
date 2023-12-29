<script lang="ts">
import { defineComponent } from 'vue'
import LineItem from './LineItem.vue'
import TextField from './TextField.vue'

export default defineComponent({
  name: 'LineItems',
  components: { LineItem, TextField },
  props: [ 'lineItems' ],

  methods: {
    addItem(item = {
        type: '',
        description: '',
        rate: null,
        quantity: null
    }) {
      this.lineItems.push(item)
    },
    deleteItem(index: number) {
      this.lineItems.splice(index, 1)
      if (!this.lineItems.length) {
        this.addItem()
      }
    },
    handleEndOfLine(index: number) {
      const lastIndex = this.lineItems.length - 1
      const lastLine = this.lineItems[lastIndex]
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
    <LineItem v-for="(item, index) in lineItems"
      class="line-item"
      :key="`lineitem-${index}`"
      v-model:type="item.type"
      v-model:description="item.description"
      v-model:rate="item.rate"
      v-model:quantity="item.quantity"
      @delete="deleteItem(index)"
      @endOfLine="handleEndOfLine(index)"
    />
  </div>
</template>