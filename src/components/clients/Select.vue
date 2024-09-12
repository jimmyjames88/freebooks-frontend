<script lang="ts">
import { defineComponent } from 'vue'
import { _Client, _Collection } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { AutoComplete } from '@/components'

interface _SelectItem {
  value: number
  title: string
}

interface _ClientListItem {
  id: number
  name: string
}

export default defineComponent({
  name: 'Clients.Select',
  inheritAttrs: false,
  components: { AutoComplete },
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data: (): {
    clients: _ClientListItem[]
  } => ({
    clients: [],
  }),
  mounted() {
    this.loadClients()
  },
  computed: {
    value: {
      get(): number {
        return this.modelValue?.id
      },
      async set(id: number) {
        const client = this.clients.find((client: _ClientListItem) => client.id === id)
        this.$emit('update:modelValue', client)
      }
    },
    clientList(): _SelectItem[] {
      return this.clients.map((client: _ClientListItem) => ({
        value: Number(client.id),
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
      try {
        const data: _Collection<{ id: number, name: string }> = await API.clients.list()
        this.clients = data.items
      } catch (err: any) {
        console.warn(err)
      }
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