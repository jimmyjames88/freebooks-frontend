<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from '@/components'

export default defineComponent({
  name: 'ConfirmDeleteDialog',
  emits: ['close', 'confirm'],
  components: { Button },
})
</script>

<template>
  <v-dialog width="auto" :model-value="true">
    <v-card>
      <v-card-text>
        Confirm delete?
      </v-card-text>
      <v-card-text class="text-center">
        <Button color="transparent" @click="$emit('close', false)">Cancel</Button>
        <Button color="primary" @click="$emit('confirm')">Yes, Delete</Button>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>