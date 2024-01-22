<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosError, AxiosResponse } from 'axios'
import { _Client } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import AutoComplete from './AutoComplete.vue'

interface _SelectItem {
  value: number
  title: string
}

export default defineComponent({
  name: 'ClientSelect',
  inheritAttrs: false,
  components: { AutoComplete },
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data: (): {
    clients: _Client[]
  } => ({
    clients: [],
  }),
  mounted() {
    this.loadClients()
  },
  computed: {
    value: {
      get(): number {
        return this.modelValue || undefined
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      }
    },
    clientList(): _SelectItem[] {
      return this.clients.map((client: _Client) => ({
        value: client.id,
        title: client.name
      })).sort((a: _SelectItem, b: _SelectItem) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1
        if (a.title.toLowerCase() > b.title.toLowerCase()) return 1
        return 0
      })
    },
  },
  methods: {
    async loadClients() {
      await API.clients.list().then((response: AxiosResponse) => {
        this.clients = response.data
        if (this.$route.query.clientId)
          this.value = Number(this.$route.query.clientId)
      }).catch((err: AxiosError) => {
        console.warn(err)
      })
    },
  }
})
</script>

<template>
  <AutoComplete 
    v-model="value"
    v-bind="$attrs"
    :items="clientList"
    label="Client" 
    variant="outlined" 
    prepend-inner-icon="mdi-account" 
    clearable 
  />
</template>