<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { Avatar, Header, Spinner, TextField } from '@/components'
import { _ClientInputCreate } from '@jimmyjames88/freebooks-types'
import { Client } from '@/classes'
import ClientForm from './_Form.vue'

export default defineComponent({
  name: 'Clients/Edit',
  components: { Avatar, ClientForm, Header, Spinner, TextField },
  data: (): {
    loading: boolean
    step: number
    client: Client
  } => ({
    loading: true,
    step: 1,
    client: new Client()
  }),
  async mounted() {
    await this.client.get(Number(this.$route.params.ClientId))
    this.loading = false
  },
  methods: {
    async save(form: Client) {
      try {
        const client = await form.save()
        useToast().success('Client updated')
        this.$router.push({ name: 'Clients/Show', params: { ClientId: client.id } })
      } catch (err) {
        useToast().error('An error occurred while creating the client')
        console.warn(err)
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
})
</script>

<template>
  <Spinner v-if="loading" />
  <div v-else>
    <Header :title="client.name">
      <template #title>
        <h1>
          <span>{{ client.name }}</span>
          <Avatar :name="client.name" class="ml-4" />
        </h1>
      </template>
    </Header>
    <v-container>
      <ClientForm :client="client" @submitForm="save" />
    </v-container>
  </div>
</template>