<script lang="ts">
import { defineComponent } from 'vue'
import { SubmitEventPromise } from 'vuetify'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/Auth'
import { Button, GradientContainer, Logo, TextField } from '@/components'

export default defineComponent({
  name: 'Login',
  components: { Button, GradientContainer, Logo, TextField },
  data: (vm): {
    email: string
    password: string
    loading: boolean
    rules: { [key: string]: Function[] }
  } => ({
    email: '',
    password: '',
    loading: false,
    rules: {
      email: [
        (value: string) => value ? true : 'You must enter an email address'
      ],
      password: [
        (value: string) => {
          return value ? true : 'Please enter your password'
        },
        async () => {
          return await vm.login(vm.email, vm.password) ? true : 'Incorrect password'
        }
      ]
    }
  }),
  methods: {
    ...mapActions(useAuthStore, ['login']),

    async submit(event: SubmitEventPromise) {
      this.loading = true
      const results = await event
      this.loading = false
      this.password = ''
      if (results.valid) {
        this.$router.push({ name: 'Dashboard' })
      }
    }
  }
})
</script>

<template>
  <GradientContainer bgColor="#56CBF9">
    <template #left>
      <div>
        <Logo />
      </div>
    </template>
    <template #right>
      <v-form @submit.prevent="submit" validate-on="submit">
        <TextField v-model="email" type="email" label="Email" :rules="rules.email" />
        <TextField v-model="password" type="password" label="Password" :rules="rules.password" class="my-2" />
        <Button type="submit" color="secondary" :loading="loading">
          <v-icon>mdi-login</v-icon> Sign in
        </Button>
        <Button color="transparent" :to="{ name: 'Auth/Register' }">
          <v-icon>mdi-account-plus</v-icon> Sign up!
        </Button>
        <Button color="transparent" to="/">
          <v-icon>mdi-lock</v-icon> Forgot
        </Button>
      </v-form>
    </template>
  </GradientContainer>
</template>
