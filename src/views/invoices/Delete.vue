<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';
import { Button, GradientContainer, TextField } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'Invoices/Delete',
  components: { Button, GradientContainer, TextField },
  data: () => ({
    submitting: false
  }),
  methods: {
    destroy() {
      this.submitting = true
      const id = this.$route.params.InvoiceId
      API.invoices.destroy(id).then((response: AxiosResponse) => {
        if (response.status === 204) {
          useToast().success('Invoice deleted')
          return this.$router.push({ name: 'Invoices/Index' })
        }
        useToast().error('Something went wrong')
        console.warn(response.message, response)
      }).catch((err: AxiosError) => {
        useToast().error('Something went wrong')
        console.warn(err)
      }).finally(() => {
        this.submitting = false
      })
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
      <h1>Delete Invoice</h1>
    </template>
    <template #right>
      <h3><span class="text-primary">Warning:</span> This action cannot be undone.</h3>
      <p class="mb-8">Are you sure you want to delete this invoice?</p>
      <Button @click="cancel" color="transparent" :disabled="submitting">
        Cancel
      </Button>
      <Button @click="destroy" color="primary" :loading="submitting">
        Delete
      </Button>
    </template>
  </GradientContainer>
</template>