<script lang="ts">
import { defineComponent } from 'vue'
import { Button, Checkbox, Select, TextField } from '@/components'
import { _Tax } from '@jimmyjames88/freebooks-types'

export default defineComponent({
  name: 'Settings/Taxes/_Form',
  components: { Button, Checkbox, Select, TextField },
  props: {
    formData: {
      type: Object,
      required: false
    }
  },
  data: (): {
    form: _Tax
    taxTypes: { title: string, value: string }[]
  } => ({
    form: {
      name: '',
      type: null,
      rate: null,
      default: false
    },
    taxTypes: [
      { title: 'Percentage', value: 'PERCENTAGE' },
      { title: 'Flat', value: 'FLAT' }
    ]
  }),
  mounted() {
    this.applyFormData()
  },
  methods: {
    applyFormData() {
      if (this.formData) {
        this.form = JSON.parse(JSON.stringify(this.formData))
      }
    },
    submitForm() {
      this.$emit('submitForm', this.form)
    }
  }
})
</script>

<template>
  <v-form @submit.prevent="submitForm">
    <TextField v-model="form.name" label="Name" hint="Recommend using acronyms ex. GST, PST, VAT, etc..." />
    <Select v-model="form.type" label="Type" :items="taxTypes" variant="outlined" />
    <TextField v-model="form.rate" 
      label="Rate" 
      :disabled="!form.type"
      :prepend-inner-icon="form.type === 'FLAT' ? 'mdi-currency-usd' : ''"
      :hint="form.type === 'PERCENTAGE' ? 'Enter as a decimal value ex. 0.05 = 5%' : 'Enter as a dollar figure ex. 100.00 = $100'"
    />
    <p>
      <Checkbox v-model="form.default" label="Apply this tax by default to all new invoices" />
    </p>
    <div class="d-flex justify-end">
      <Button type="submit" color="primary">
        <v-icon>mdi-check</v-icon> Save
      </Button>
      <Button type="button" color="transparent" @click="$emit('cancel')">
        <v-icon>mdi-close</v-icon> Cancel
      </Button>
    </div>
  </v-form>
</template>