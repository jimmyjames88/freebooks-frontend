<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';
import { AxiosError, AxiosResponse } from 'axios'
import { Button, GradientContainer, TextField } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'Clients/Delete',
  components: { Button, GradientContainer, TextField },
  data: () => ({
    submitting: false
  }),
  methods: {
    destroy() {
      this.submitting = true
      const id = this.$route.params.ClientId
      API.clients.destroy(id).then((response: AxiosResponse) => {
        if (response.status === 204) {
          useToast().success('Client deleted')
          return this.$router.push({ name: 'Clients/Index' })
        }
        useToast().error('Something went wrong')
      }).catch((err: AxiosError) => {
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