<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosError, AxiosResponse } from 'axios'
import { useToast } from 'vue-toastification'
import { _Tax } from '@jimmyjames88/freebooks-types'
import { GradientContainer } from '@/components'
import TaxesForm from './_Form.vue'
import API from '@/api'

export default defineComponent({
  name: 'Settings/Taxes/Create',
  components: { GradientContainer, TaxesForm },
  data: (): {
    loading: boolean,
    formData: Partial<_Tax>
  } => ({
    loading: true,
    formData: {
      name: '',
      rate: 0,
      type: undefined,
      default: false
    }
  }),
  mounted() {
    this.loadTax()
  },
  computed: {
    taxId(): number { return Number(this.$route.params.taxId) }
  },
  methods: {
    loadTax() {
      this.loading = true
      API.taxes.show(this.taxId).then((response: AxiosResponse) => {
        this.formData = response.data
      })
      .finally(() => {
        this.loading = false
      })
    },
    save(tax: _Tax) {
      API.taxes.update({ ...tax, id: this.taxId }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          useToast().success('Changes saved')
          this.$router.push({ name: 'Settings' })
          return
        }
        throw new AxiosError('Error saving')
      }).catch((err: AxiosError) => {
        useToast().error(err.message)
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
})
</script>

<template>
  <GradientContainer bgColor="#679dbd">
    <template #left>
      <h1>Edit Tax</h1>
    </template>
    <template #right>
      <TaxesForm v-if="!loading" @submitForm="save" @cancel="cancel" :formData="formData" />
    </template>
  </GradientContainer>
</template>

<style lang="scss" scoped>
// Todo Checkbox component
:deep(.v-label) {
  opacity: 1 !important;
}
</style>