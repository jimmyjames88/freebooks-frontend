<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { _Tax, _TaxType } from '@jimmyjames88/freebooks-types'
import Expense from '@/classes/Expense'
import { Button } from '@/components'

export default defineComponent({
    name: 'Expenses',
    props: {
        expenses: {
            type: Array as PropType<Expense[]>,
            required: true
        }
    },
    methods: {
        taxTotal(amount: number, taxes?: _Tax[]): number {
            return taxes?.reduce((acc, tax) => {
                if (tax.type === _TaxType.PERCENTAGE) {
                    return acc + (amount * tax.rate);
                }
                else {
                    return acc + tax.rate;
                }
            }, 0) || 0
        }
    },
    components: { Button }
})
</script>

<template>
  <div>
    <div class="d-flex mb-8">
      <h2>Expenses</h2>
    </div>
    <v-row>
      <v-col>
        <h3>Date</h3>
      </v-col>
      <v-col>
        <h3>Description</h3>
      </v-col>
      <v-col>
        <h3>Amount</h3>
      </v-col>
      <v-col>
        <h3>Tax</h3>
      </v-col>
      <v-col align="end">
        <h3>Total</h3>
      </v-col>
    </v-row>
    <v-row v-for="(expense, index) in expenses" :key="`expense-${index}`" class="line-item">
      <v-col>{{ expense.date }}</v-col>
      <v-col>{{ expense.description }}</v-col>
      <v-col>${{ expense.subtotal.toFixed(2) }}</v-col>
      <v-col>${{ taxTotal(expense.subtotal, expense.Taxes).toFixed(2) }}</v-col>
      <v-col align="end">
        ${{ Number(taxTotal(expense.subtotal, expense.Taxes) + expense.subtotal).toFixed(2) }}
      </v-col><!-- todo: optimize pattern, don't like calling taxTotal twice per line -->
    </v-row>
  </div>
</template>