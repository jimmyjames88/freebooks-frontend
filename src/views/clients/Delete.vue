<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';
import { Button, GradientContainer, TextField } from '@/components'
import { Client } from '@/classes'

export default defineComponent({
  name: 'Clients/Delete',
  components: { Button, GradientContainer, TextField },
  data: () => ({
    submitting: false
  }),
  methods: {
    async destroy() {
      this.submitting = true
      const id = Number(this.$route.params.ClientId)
      try {
        await new Client({ id }).destroy()
        useToast().success('Client deleted')
        return this.$router.push({ name: 'Clients/Index' })
      } catch (err) {
        console.warn(err)
        useToast().error('Something went wrong')
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
      <h1>Delete Client</h1>
    </template>
    <template #right>
      <h3><span class="text-primary">Warning:</span> All invoices and estimates for this client will also be deleted.</h3>
      <p class="mb-8">Are you sure you want to delete this client?</p>
      <Button @click="cancel" color="transparent" :disabled="submitting">
        Cancel
      </Button>
      <Button @click="destroy" color="primary" :loading="submitting">
        Delete
      </Button>
    </template>
  </GradientContainer>
</template>