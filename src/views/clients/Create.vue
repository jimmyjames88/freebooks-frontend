<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { _Client } from '@jimmyjames88/freebooks-types'
import { Button, GradientContainer, TextField } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'Clients/Create',
  components: { Button, GradientContainer, TextField },
  data: (): {
    step: number,
    form: Omit<_Client, 'id'>
  } => ({
    step: 1,
    form: {
      name: '',
      email: '',
      phone: '',
      website: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal: '',
        country: ''
      }
    }
  }),
  methods: {
    async save() {
      try {
        const client = await API.clients.store(this.form)
        useToast().success('Client created successfully')
        this.$router.push({ name: 'Clients/Show', params: { clientId: client.id } })
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
  <GradientContainer>
    <template #left>
      <h1>New Client</h1>
    </template>
    <template #right>
      <v-form @submit.prevent="save">
        <v-window v-model="step"
          height="auto"
          direction="vertical"
          hide-delimiters
          :show-arrows="false">
          <v-window-item :value="1">
            <div>
              <TextField name="name" label="Name" v-model="form.name" />
              <TextField name="email" label="Email" v-model="form.email" />
              <TextField name="phone" label="Phone" v-model="form.phone" />
              <TextField name="website" label="Website" v-model="form.website" placeholder="https://" />
              <Button @click="cancel" color="transparent">
                Cancel
              </Button>
              <Button @click="step++" color="secondary">
                Next
              </Button>
            </div>
          </v-window-item>
          <v-window-item :value="2">
            <div>
              <TextField name="line1" v-model="form.address?.line1" label="Line 1" />
              <TextField name="line2" v-model="form.address?.line2"   label="Line 2" />
              <TextField name="city" v-model="form.address?.city" label="City" />
              <TextField name="state" v-model="form.address?.state" label="state" />
              <TextField name="postal" v-model="form.address?.postal" label="Postal Code" />
              <TextField name="country" v-model="form.address?.country" label="Country" />
              <Button color="transparent" @click="step--">Previous</Button>
              <Button type="submit" color="secondary">Save</Button>
            </div>
          </v-window-item>
        </v-window>
      </v-form>
    </template>
  </GradientContainer>
</template>