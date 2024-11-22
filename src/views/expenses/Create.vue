<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { Header, Spinner } from '@/components'
import { Expense } from '@/classes'
import ExpenseForm from './_Form.vue'

export default defineComponent({
  name: 'Expenses/Create',
  components: { ExpenseForm, Header, Spinner },
  data: (): {
    expense: Expense
    loading: boolean
  } => ({
    expense: new Expense(),
    loading: true
  }),
  async mounted() {
    this.loading = false
  },
  methods: {
    async submitForm(form: Expense) {
      try {
        await form.save()
        useToast().success('Expense updated')
        this.$router.push({ name: 'Expenses/Show', params: { ExpenseId: form.id }})
      } catch(err) {
        console.error(err)
      }
    }
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <div v-else>
    <Header title="New Expense" />
    <v-container>
      <ExpenseForm
        :expense="expense"
        @submitForm="submitForm"
      />
    </v-container>
  </div>
</template>