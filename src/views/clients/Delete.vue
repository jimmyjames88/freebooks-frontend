<script lang="ts">
import { defineComponent } from 'vue';
import { useToast } from 'vue-toastification';
import { Button, GradientContainer, TextField } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'Clients/Delete',
  components: { Button, GradientContainer, TextField },
  methods: {
    destroy() {
      const id = this.$route.params.clientId
      
      API.clients.destroy(id).then((response: AxiosResponse) => {
        useToast().success('Client deleted')
        this.$router.push({ name: 'Clients/Index' })
      }).catch((err: AxiosError) => {
        console.warn(err)
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
      <Button @click="cancel" color="transparent">
        Cancel
      </Button>
      <Button @click="destroy" color="primary">
        Delete
      </Button>
    </template>
  </GradientContainer>
</template>