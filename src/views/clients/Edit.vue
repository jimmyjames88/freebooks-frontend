<script lang="ts">
import { defineComponent } from 'vue';
import { Button, GradientContainer, TextField } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'Clients/Edit',
  components: { Button, GradientContainer, TextField },
  data: () => ({
    step: 1,
    _id: '',
    name: '',
    email: '',
    phone: '',
    website: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      province: '',
      postal: '',
      country: ''
    }
  }),
  async mounted() {
    // load data from clients.show endpoint
    const response = await API.clients.edit(this.$route.params.clientId)
    // set data properties
    const { _id, name, email, phone, website, address } = response.data
    this._id = _id
    this.name = name
    this.email = email
    this.phone = phone
    this.website = website
    this.address.line1 = address.line1
    this.address.line2 = address.line2
    this.address.city = address.city
    this.address.province = address.province
    this.address.postal = address.postal
    this.address.country = address.country
  },
  methods: {
    save() {
      const { _id, name, email, phone, website, address } = this
      API.clients.update({  _id, name, email, phone, website, address }).then(() => {
        this.$router.push({ name: 'Clients/Show', params: { clientId: this._id } })
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
  <GradientContainer>
    <template #left>
      <h1>Edit Client</h1>
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
              <TextField name="name" label="Name" v-model="name" />
              <TextField name="email" label="Email" v-model="email" />
              <TextField name="phone" label="Phone" v-model="phone" />
              <TextField name="website" label="Website" v-model="website" placeholder="https://" />
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
              <TextField name="line1" v-model="address.line1" label="Line 1" />
              <TextField name="line2" v-model="address.line2" label="Line 2" />
              <TextField name="city" v-model="address.city" label="City" />
              <TextField name="province" v-model="address.province" label="Province" />
              <TextField name="postal" v-model="address.postal" label="Postal Code" />
              <TextField name="country" v-model="address.country" label="Country" />
              <Button color="transparent" @click="step--">Previous</Button>
              <Button type="submit" color="secondary">Save</Button>
            </div>
          </v-window-item>
        </v-window>
      </v-form>
    </template>
  </GradientContainer>
</template>