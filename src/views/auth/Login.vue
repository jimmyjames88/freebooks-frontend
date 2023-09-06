<script lang="ts">
import { defineComponent } from 'vue'
import validator from 'validator'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/Auth'
import { Button, GradientContainer, Logo, TextField } from '@/components'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'Login',
  components: { Button, GradientContainer, Logo, TextField },
  data: (): {
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
        }
      ]
    }
  }),
  methods: {
    ...mapActions(useAuthStore, ['login']),

    async attemptLogin() {
      this.loading = true
      try {
        await this.login(this.email, this.password)
        if (this.$route.query.ref)
          return window.location.href = this.$route.query.ref
        return this.$router.push({ name: 'Clients/Index' })
    
      } catch(err) {
        console.warn(err)
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
      <v-form @submit.prevent="attemptLogin" validate-on="submit">
        <TextField v-model="email" label="Email" :rules="rules.email" />
        <TextField v-model="password" type="password" label="Password" :rules="rules.password" class="my-2" />
        <Button type="submit" color="secondary">
          <v-icon>mdi-login</v-icon> Sign in
        </Button>
        <Button color="transparent" to="/">
          <v-icon>mdi-account-plus</v-icon> Sign up!
        </Button>
        <Button color="transparent" to="/">
          <v-icon>mdi-lock</v-icon> Forgot
        </Button>
      </v-form>
    </template>
  </GradientContainer>
</template>

<style lang="scss" scoped>

</style>
