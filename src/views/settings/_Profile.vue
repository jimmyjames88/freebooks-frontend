<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState, mapActions } from 'pinia'
import { AxiosResponse } from 'axios'
import { _Profile, _User } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { Button, TextField } from '@/components'
import { useAuthStore } from '@/stores'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'Settings/Profile',
  components: { Button, TextField },
  data: (): {
    form: _Profile
  } => ({
    form: {
      displayName: '',
      displayEmail: '',
      phone: '',
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
  computed: {
    ...mapWritableState(useAuthStore, ['user'])
  },
  mounted() {
    // Clone the user profile
    this.form = JSON.parse(JSON.stringify(this.user.profile))
  },
  methods: {
    ...mapActions(useAuthStore, ['setUser']),
    save() {
      const user: Partial<_User> = {
        id: Number(this.user?.id),
        profile: this.form
      }
      API.users.update(user).then((response: AxiosResponse) => {
        if (response.status === 200) {
          this.setUser(response.data)
          useToast().success('Profile updated')
          return
        }
        useToast().error('Error updating profile')
      }).catch(() => {
        useToast().error('Error updating profile')
      })
    }
  }
})
</script>

<template>
  <v-form v-if="user && user.profile" @submit.prevent="save">
    <v-row>
      <v-col cols="12" md="6">
        <TextField
          v-model="form.displayName"
          label="Display Name"
          hint="Displayed by default on documents"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="form.displayEmail"
          label="Display Email"
          hint="Displayed by default on documents, not for logging in"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="form.phone"
          label="Phone"
        />
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-8" />
    <v-row>
      <v-col cols="12">
        <TextField
          v-model="form.address.line1"
          label="Address Line 1"
        />
      </v-col>
      <v-col cols="12">
        <TextField
          v-model="form.address.line2"
          label="Address Line 2"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="form.address.city"
          label="City"
        />
      </v-col>
      <v-col cols="12" md="4">
        <TextField
          v-model="form.address.state"
          label="State"
        />
      </v-col>
      <v-col cols="12" md="2">
        <TextField
          v-model="form.address.postal"
          label="Postal"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="form.address.country"
          label="Country"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" align="end">
        <Button type="submit" color="primary">Save</Button>
      </v-col>
    </v-row>
  </v-form>
</template>