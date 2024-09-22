<script lang="ts">
import { defineComponent } from 'vue'
import { SubmitEventPromise } from 'vuetify'
import { useToast } from 'vue-toastification'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores'
import { Button, GradientContainer, TextField } from '@/components'

export default defineComponent({
  name: 'Auth/Register',
  components: { Button, GradientContainer, TextField },
  data(vm) {
    return {
      loading: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      rules: {
        name: [
          (value: string) => {
            return value ? true : 'Please enter your name'
          }
        ],
        email: [
          (value: string) => value ? true : 'You must enter an email address',
          (value: string) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return regex.test(value) ? true : 'Please enter a valid email address'
          },
          async () => {
            return await vm.checkEmail(vm.email) === false ? true : 'Email address already in use'
          }
        ],
        password: [
          (value: string) => {
            return value ? true : 'Please enter your password'
          }
        ],
        confirmPassword: [
          (value: string) => {
            return value ? true : 'Please confirm your password'
          },
          (value: string) => {
            return value === this.password ? true : 'Passwords do not match'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['login', 'register', 'checkEmail']),

    async submit(event: SubmitEventPromise) {
      this.loading = true
      const results = await event
      this.loading = false
      console.log('RESULTS', results)
      if (results.valid) {
        const registration = await this.register({
          name: this.name, email: this.email, password: this.password
        })
        if (!registration) {
          useToast().error('There was a problem creating your account')
          throw new Error('There was a problem creating your account')
        }
        useToast().success('Account created successfully')
        this.$router.push({ name: 'Auth/Login' })
      }
    }
  },
})
</script>

<template>
  <GradientContainer bgColor="#336699">
    <template #left>
      <div>
        <h1>Sign Up</h1>
      </div>
    </template>
    <template #right>
      <v-form @submit.prevent="submit" validate-on="submit">
        <TextField v-model="name" type="text" label="Name" :rules="rules.name" />
        <TextField v-model="email" type="email" label="Email" :rules="rules.email" />
        <TextField v-model="password" type="password" label="Password" :rules="rules.password" class="my-2" />
        <TextField v-model="confirmPassword" 
          type="password"
          label="Confirm"
          class="my-2"
          :rules="rules.confirmPassword"
        />
        <Button color="transparent" to="/">
          <v-icon>mdi-close</v-icon> Cancel
        </Button>
        <Button type="submit" color="secondary" :loading="loading">
          <v-icon>mdi-check</v-icon> Create Account
        </Button>
      </v-form>
    </template>
  </GradientContainer>
</template>