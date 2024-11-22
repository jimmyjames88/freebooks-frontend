<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';
import { Button, GradientContainer, TextField } from '@/components'
import { Expense } from '@/classes'

export default defineComponent({
  name: 'Expense/Delete',
  components: { Button, GradientContainer, TextField },
  data: () => ({
    submitting: false
  }),
  methods: {
    async destroy() {
      this.submitting = true
      const id = Number(this.$route.params.ExpenseId)
      try {
        await new Expense({ id }).destroy() 
        useToast().success('Expense deleted')
        return this.$router.push({ name: 'Expenses/Index' })
      } catch (err) {
        useToast().error('Something went wrong')
        console.warn(err)
      } finally {
        this.submitting = false
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
})
</script>

<template>
  <GradientContainer bgColor="black">
    <template #left>
      <h1>Delete Expense?</h1>
    </template>
    <template #right>
      <div>
        <h3><span class="text-primary">Warning:</span> This action cannot be undone.</h3>
        <p class="mb-8">Are you sure you want to delete this expense?</p>
        <Button @click="cancel" color="transparent" :disabled="submitting">
          Cancel
        </Button>
        <Button @click="destroy" color="primary" :loading="submitting">
          Delete
        </Button>
      </div>
    </template>
  </GradientContainer>
</template>