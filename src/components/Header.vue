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
      <v-col class="d-flex">
        <div>
          <slot name="title">
            <h1>{{ title }}</h1>
          </slot>
        </div>
        <div class="ml-auto">
          <slot name="desktop" />
        </div>
      </v-col>
    </v-row>
  </v-container>
  <v-app-bar
    v-else
    color="primary"
    flat
  >
    <v-app-bar-nav-icon variant="text" @click.stop="toggleNav()" />
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-menu v-if="$slots.mobile">
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical" />
      </template>
      <slot name="mobile" />
    </v-menu>
  </v-app-bar>
    
</template>

<style lang="scss" scoped>
.v-toolbar-title {
  font-family: 'Fira Sans';
  font-size: 1.5rem;
}
</style>