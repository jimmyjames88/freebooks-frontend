<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import { mapState } from 'pinia'
import { _Profile, _User } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { Button, TextField } from '@/components'
import { useAuthStore } from '@/stores'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'Settings/Profile',
  components: { Button, TextField },
  data: (): {
    profile: _Profile
  } => ({
    profile: {
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
    ...mapState(useAuthStore, ['user'])
  },
  mounted() {
    this.loadUser()
  },
  methods: {
    loadUser() {
      API.users.getProfile(Number(this.user?.id))
        .then((res: AxiosResponse) => {
          this.profile = res.data
        })
    },
    save() {
      const user: Partial<_User> = {
        id: Number(this.user?.id),
        profile: this.profile as _Profile
      }
      API.users.update(user).then(() => {
        useToast().success('Profile updated')
      })
    }
  }
})
</script>

<template>
  <v-form @submit.prevent="save">
    <v-row>
      <v-col cols="12" md="6">
        <TextField
          v-model="profile.displayName"
          label="Display Name"
          hint="Displayed by default on documents"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="profile.displayEmail"
          label="Display Email"
          hint="Displayed by default on documents, not for logging in"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="profile.phone"
          label="Phone"
        />
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-8" />
    <v-row>
      <v-col cols="12">
        <TextField
          v-model="profile.address.line1"
          label="Address Line 1"
        />
      </v-col>
      <v-col cols="12">
        <TextField
          v-model="profile.address.line2"
          label="Address Line 2"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="profile.address.city"
          label="City"
        />
      </v-col>
      <v-col cols="12" md="4">
        <TextField
          v-model="profile.address.state"
          label="State"
        />
      </v-col>
      <v-col cols="12" md="2">
        <TextField
          v-model="profile.address.postal"
          label="Postal"
        />
      </v-col>
      <v-col cols="12" md="6">
        <TextField
          v-model="profile.address.country"
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