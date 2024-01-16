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
  methods: {
    save(tax: _Tax) {
      API.taxes.store(tax).then((response: AxiosResponse) => {
        if (response.status === 201) {
          useToast().success('Tax created')
          this.$router.go(-1)
          return
        }
        throw new AxiosError('Error creating tax')
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
      <h1>New Tax</h1>
    </template>
    <template #right>
      <TaxesForm @submitForm="save" @cancel="cancel" />
    </template>
  </GradientContainer>
</template>

<style lang="scss" scoped>
// Todo Checkbox component
:deep(.v-label) {
  opacity: 1 !important;
}
</style>