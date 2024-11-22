<script lang="ts">
import { defineComponent } from 'vue'
import { Button } from '@/components'

export default defineComponent({
  name: 'Expenses/ReceiptUploader',
  components: { Button },
  props: {
    expenseId: {
      type: Number,
      required: true
    }
  },
  data: (): {
    file: File | null
  } => ({
    file: null
  }),
  methods: {
    async upload() {
      if (!this.file) return
      const formData = new FormData()
      formData.append('file', this.file)
      this.$emit('uploaded')
    }
  }
})
</script>

<template>
  <v-card variant="flat">
    <v-card-text>
      <v-row>
        <v-col>
          <v-file-input v-model="file" accept="image/*" label="Select a file" />
        </v-col>
      </v-row>
      <v-row>
        <v-col align="end">
          <Button color="primary">
            <v-icon>mdi-upload</v-icon> Upload
          </Button>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>