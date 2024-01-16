<script lang="ts">
import { defineComponent } from 'vue'
import { Header } from '@/components'
import ProfileSettings from './_Profile.vue'
import TaxesSettings from './_Taxes.vue'

export default defineComponent({
  name: 'Settings',
  components: { Header, ProfileSettings, TaxesSettings },
  data: () => ({
    activeTab: 0
  })
})
</script>

<template>
  <Header title="Settings" />
  <v-container>
    <v-tabs v-model="activeTab">
      <v-tab>Profile</v-tab>
      <v-tab>Taxes</v-tab>
      <v-tab disabled>Email</v-tab>
      <v-tab>Account</v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item>
        <ProfileSettings />
      </v-window-item>
      <v-window-item>
        <TaxesSettings />
      </v-window-item>
      <v-window-item>Email</v-window-item>
      <v-window-item>Account</v-window-item>
    </v-window>
  </v-container>
</template>