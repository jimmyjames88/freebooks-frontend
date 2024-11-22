<script lang="ts">
import { defineComponent } from 'vue'
import { Button, Select, TextField } from '@/components'
import { formatCurrency } from '@/utils';

export default defineComponent({
  name: 'Invoices.LineItem',
  components: { Button, Select, TextField },
  emits: [
    'blur',
    'delete',
    'endOfLine',
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
      return formatCurrency(value)
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
    <v-col cols="12" md="6">
      <TextField
        :value="description"
        variant="outlined"
        @update:model-value="$emit('update:description', $event)"
        @blur="$emit('blur')"
      />
    </v-col>
    <v-col cols="6" md="2">
      <TextField
        prepend-inner-icon="mdi-currency-usd"
        :value="rate"
        variant="outlined"
        @blur="$emit('blur')"
        @update:model-value="$emit('update:rate', $event)"
      />
    </v-col>
    <v-col cols="6" md="1">
      <TextField 
        :value="quantity"
        variant="outlined"
        @blur="$emit('blur')"
        @keydown="handleQuantityKeydown"
        @update:modelValue="$emit('update:quantity', $event)"
      />
    </v-col>
    <v-col cols="10" md="2">{{ lineTotal }}</v-col>
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