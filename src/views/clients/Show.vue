<script lang="ts">
import { defineComponent } from 'vue';
import { AxiosResponse } from 'axios';
import API from '@/api'
import { Button } from '@/components'

export default defineComponent({
  name: 'Client.Show',
  components: { Button },
  data: () => ({
    name: '',
    email: '',
    address: '',
    phone: '',
    website: '',
    invoices: []
  }),
  mounted() {
    console.log(this.$route.params.clientId)
    API.clients.show(this.$route.params.clientId)
      .then((response: AxiosResponse) => {
        const { name, email, address, phone, website, invoices } = response.data
        this.name = name
        this.email = email
        this.address = address
        this.phone = phone
        this.website = website
        this.invoices = invoices
      })
      .catch((err: Error) => console.warn(err))
  }
})
</script>

<template>
  <v-container>
    <v-row justify="start" align="center">
      <v-col>
        <h1 v-text="name" />
      </v-col>
      <v-col align="end">
        <Button color="primary">New Invoice</Button>
        <Button color="primary">New Estimate</Button>
      </v-col>
    </v-row>
    <h2>Invoices</h2>
    <v-row>
      <v-col>
        
      </v-col>
    </v-row>
  </v-container>
</template>