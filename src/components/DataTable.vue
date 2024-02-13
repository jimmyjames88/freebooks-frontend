<script lang="ts">
import { defineComponent } from 'vue'
import Button from './Button.vue'
import TextField from './TextField.vue'

export default defineComponent({
  name: 'DataTable',
  inheritAttrs: false,
  components: { Button, TextField },
  
  data: () => ({
    search: '',
    searchTrigger: ''
  }),

  props: {
    itemsLength: {
      type: Number,
      required: true
    }
  },

  methods: {
    triggerSearch() {
      this.searchTrigger = Date.now().toString()  
    }
  }
})
</script>

<template>
  <v-data-table-server
    :itemsLength="itemsLength"
    :items-per-page-options="[10, 25, 50, 100]"
    v-bind="$attrs"
    :search="searchTrigger"
    @update:options="$emit('loadItems', $event, search)"
  >
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>

    <template #top>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <TextField
              ref="search"
              variant="underlined"
              v-model="search"
              single-line
              clearable
              hide-details
              placeholder="Search"
              @keypress.enter="triggerSearch"
              @clear="triggerSearch"
              class="mt-n4"
            >
              <template #append-inner>
                <v-icon @click="triggerSearch">mdi-magnify</v-icon>
              </template>
            </TextField>
          </v-col>
        </v-row>
      </v-container>
    </template>

  </v-data-table-server>  
</template>