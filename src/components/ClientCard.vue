<script lang="ts">
import { defineComponent } from 'vue';
import { Button } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'ClientCard',
  components: { Button },
  props: {
    _id: String,
    name: String,
    email: String,
    phone: String,
    website: String
  },

  data: () => ({
    showConfirmDelete: false
  }),

  computed: {
    initials() {
      const words = this.name?.split(' ')
      const initials = words?.map(word => word.substring(0,1)) as string[]
      const first = initials[0]

      if (initials.length > 1) {
        const last = initials[initials.length -1]
        return `${first}${last}`.toUpperCase()
      }

      return first.toUpperCase()
    }
  },

  methods: {
    confirmDelete() {
      this.showConfirmDelete = true
    },
    handleDelete() {
      API.clients.destroy(this.id).then(() => {
        this.$emit('delete')
      }).catch((err: AxiosError) => {
        console.warn(err)
      })
      this.showConfirmDelete = false
    }
  }
})
</script>

<template>
  <article>
    <v-card variant="flat">
      <v-toolbar color="transparent">
        <template #prepend>
          <router-link :to="{ name: 'Clients/Show', params: { clientId: id }}">
            <v-avatar color="primary">
              <span class="text-h6">{{ initials }}</span>
            </v-avatar>
          </router-link>
        </template>
        <v-toolbar-title>
          <h3>
            <router-link :to="{ name: 'Clients/Show', params: { clientId: id }}">
              {{ name }}
            </router-link>
          </h3>
        </v-toolbar-title>
        <template #append>
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item to="/">
                  <v-icon>mdi-receipt-text-plus</v-icon> New Invoice
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle>Client Actions</v-list-item-subtitle>
              </v-list-item>
              <v-list-item :to="{ name: 'Clients/Show', params: { clientId: id }}">
                  <v-icon>mdi-account-eye</v-icon> View
              </v-list-item>
              <v-list-item :to="{ name: 'Clients/Edit', params: { clientId: id }}">
                  <v-icon>mdi-account-edit</v-icon> Edit
              </v-list-item>
              <v-list-item @click="confirmDelete">
                  <v-icon>mdi-account-remove</v-icon> Delete
              </v-list-item>
            </v-list>
              
          </v-menu>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-list>
          <v-list-item v-if="email" :href="`mailto:${email}`">
            <h4>
              <v-icon>mdi-email-outline</v-icon> {{ email }}
            </h4>
          </v-list-item>
          <v-list-item v-if="phone" :href="`tel:${phone}`">
            <h4>
              <v-icon>mdi-phone-outline</v-icon> {{ phone }}
            </h4>
          </v-list-item>
          <v-list-item v-if="website" :href="website" target="_blank">
            <h4>
              <v-icon>mdi-web</v-icon> {{ website }}
            </h4>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-dialog v-model="showConfirmDelete" width="auto">
      <v-card>
        <v-card-text>
          Are you sure you wish to delete this Client?
        </v-card-text>
        <v-card-text class="text-center">
          <Button color="transparent" @click="showConfirmDelete = false">Cancel</Button>
          <Button color="primary" @click="handleDelete">Yes, Delete</Button>
        </v-card-text>
      </v-card>
    </v-dialog>
  </article>
</template>