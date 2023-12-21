<script lang="ts">
import { defineComponent } from 'vue'
import Button from './Button.vue'
import Select from './Select.vue'
import TextField from './TextField.vue'

export default defineComponent({
  name: 'LineItem',
  components: { Button, Select, TextField },
  emits: [
    'delete',
    'endOfLine',
    'update:type',
    'update:description',
    'update:rate',
    'update:quantity'
  ],
  props: {
    type: String,
    description: String,
    rate: {
      type: [ Number, String ]
    },
    quantity: {
      type: [ Number, String ]
    }
  },
  data: () => ({
    showConfirmDelete: false
  }),
  computed: {
    lineTotal(): string {
      const value = Number((this.rate)) * Number((this.quantity))
      if (isNaN(value))
        return '$0.00'

      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      })

      return formatter.format(value)
    }
  },
  methods: {
    confirmDelete() {
      if (this.description || this.rate || this.quantity) {
        return this.showConfirmDelete = true
      }
      return this.handleDelete()
    },
    handleDelete() {
      this.showConfirmDelete = false
      this.$emit('delete')
    },
    handleQuantityKeydown(e: KeyboardEvent) {
      if (e.keyCode === 9 && !e.shiftKey && !e.altKey && !e.ctrlKey)  // tab
        this.$emit('endOfLine')
    }
  }
})
</script>

<template>
  <v-row class="line-item-row align-center">
    <v-col cols="12" md="2">
      <Select :value="type" @update:model-value="$emit('update:type', $event)" :items="['', 'Service', 'Item', 'Expense']" variant="outlined"></Select>
    </v-col>
    <v-col cols="12" md="5">
      <TextField :value="description" @update:model-value="$emit('update:description', $event)" variant="outlined" />
    </v-col>
    <v-col cols="6" md="2">
      <TextField
        :value="rate"
        variant="outlined"
        prepend-inner-icon="mdi-currency-usd"
        @update:model-value="$emit('update:rate', $event)"
      />
    </v-col>
    <v-col cols="6" md="1">
      <TextField 
        :value="quantity"
        @update:modelValue="$emit('update:quantity', $event)"
        @keydown="handleQuantityKeydown"
        variant="outlined"
      />
    </v-col>
    <v-col cols="10" md="1" class="ml-auto" align="end">{{ lineTotal }}</v-col>
    <v-col cols="2" md="1" align="end">
      <v-btn icon="mdi-close" color="primary" size="x-small" @click="confirmDelete" variant="flat" tabindex="-1"></v-btn>
      <v-dialog v-model="showConfirmDelete" width="auto">
        <v-card>
          <v-card-text>
            Confirm delete?
          </v-card-text>
          <v-card-text class="text-center">
            <Button color="transparent" @click="showConfirmDelete = false">Cancel</Button>
            <Button color="primary" @click="handleDelete">Yes, Delete</Button>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.line-item-row {
  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.015);
  }
  &:deep(.v-input__details) {
    display: none !important;
  }
}
</style>