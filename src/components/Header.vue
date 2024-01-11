<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useAppStore } from '@/stores'


export default defineComponent({
  name: 'Header',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions(useAppStore, ['toggleNav'])
  }
})
</script>

<template>
  <v-container v-if="$vuetify.display.mdAndUp">
    <v-row>
      <v-col>
        <slot name="title">
          <h1>{{ title }}</h1>
        </slot>
      </v-col>
      <v-col class="text-right ml-auto">
        <slot name="desktop" />
      </v-col>
    </v-row>
  </v-container>
  <v-app-bar
    v-else
    color="primary"
    flat
  >
    <v-app-bar-nav-icon variant="text" @click.stop="toggleNav()" />
    <v-toolbar-title>
      <h3>{{ title }}</h3>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu v-if="$slots.mobile">
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" />
      </template>
      <slot name="mobile" />
    </v-menu>
  </v-app-bar>
    
</template>