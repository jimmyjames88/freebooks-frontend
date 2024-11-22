<script lang="ts">
import { defineComponent } from 'vue'
import { Client } from '@/classes'
import { Button, TextField } from '@/components'

export default defineComponent({
  name: 'Clients/_Form',
  components: { Button, TextField },
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data: (): {
    form: Client
  } => ({
    form: new Client()
  }),
  mounted() {
    this.form = new Client(this.client)
  },
  computed: {
    submittable() {
      return this.form.name && this.form.email
    }
  },
  methods: {
    submitForm() {
      this.$emit('submitForm', this.form)
    }
  }
})
</script>

<template>
  <v-form @submit.prevent="submitForm">
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <TextField name="name" label="Name" v-model="form.name" variant="outlined" />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <TextField name="phone" label="Phone" v-model="form.phone" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="4">  
        <TextField name="email" label="Email" v-model="form.email" variant="outlined" />
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <TextField name="website" label="Website" v-model="form.website" placeholder="https://" variant="outlined" />
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <v-row>
      <v-col cols="12" md="8" lg="6">
        <TextField name="line1" v-model="form.address.line1" label="Line 1" variant="outlined" />
        <TextField name="line2" v-model="form.address.line2" label="Line 2" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" lg="3">
        <TextField name="city" v-model="form.address.city" label="City" variant="outlined" />
      </v-col>
      <v-col cols="12" md="4" lg="3">
        <TextField name="state" v-model="form.address.state" label="Province" variant="outlined" />
      </v-col>
      <v-col cols="12" md="4" lg="3">
        <TextField name="postal" v-model="form.address.postal" label="Postal Code" variant="outlined" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Button color="transparent" @click="$router.go(-1)">Cancel</Button>
        <Button type="submit" color="secondary" :disabled="!submittable">Save</Button>
      </v-col>
    </v-row>
  </v-form>
</template>