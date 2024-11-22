<script lang="ts">
import { defineComponent } from 'vue'
import { _Client, _ClientInputUpdate, _Collection } from '@jimmyjames88/freebooks-types'
import API from '@/api'
import { Client } from '@/classes'
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
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },
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
        return Number(this.modelValue)
      },
      async set(id: number) {
        this.$emit('update:modelValue', id)
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
        const response = await API.clients.list()
        if (response?.status === 200) {
          this.clients = response.data.items
        }
        
      } catch (err: any) {
        console.warn(err)
        return
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