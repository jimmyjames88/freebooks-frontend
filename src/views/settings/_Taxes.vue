<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { _Tax } from '@jimmyjames88/freebooks-types'
import { Button, TextField } from '@/components'
import API from '@/api'

export default defineComponent({
  name: 'Settings/Taxes',
  components: { Button, TextField },
  data: (): {
    Taxes: _Tax[]
  } => ({
    Taxes: []
  }),
  mounted() {
    this.loadTaxes()
  },
  methods: {
    loadTaxes() {
      API.taxes.index().then((response) => {
        this.Taxes = response.data
      })
    },
    destroy(taxId: number) {
      API.taxes.destroy(taxId).then(() => {
        // remove the tax from the list
        this.Taxes = this.Taxes.filter((tax) => tax.id !== taxId)
        useToast().success('Tax deleted')
      })
    }
  }
})
</script>

<template>
  <div class="d-flex justify-end my-4">
    <Button color="primary" :to="{ name: 'Settings/Taxes/Create' }">
      <v-icon>mdi-bank-plus</v-icon> Add Tax
    </Button>
  </div>
  <v-table>
    <thead>
      <tr>
        <th>Label</th>
        <th>Rate</th>
        <th>Applied by default</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="tax in Taxes">
        <td>{{ tax.name }}</td>
        <td v-if="tax.type === 'PERCENTAGE'">{{ tax.rate * 100 }}%</td>
        <td v-else>${{ tax.rate.toFixed(2) }}</td>
        <td>
          <v-icon v-if="tax.default">mdi-check</v-icon>
        </td>
        <td align="right">
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" icon flat size="small">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'Settings/Taxes/Edit', params: { taxId: tax.id }}">
                <v-icon>mdi-pencil</v-icon> Edit
              </v-list-item>
              <v-dialog width="500">
                <template #activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-icon>mdi-delete</v-icon> Delete
                  </v-list-item>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card :title="`Delete ${tax.name}`">
                    <v-card-text>
                      <p>Are you sure you want to delete this tax?</p>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer />
                      <Button @click="isActive.value = false">Cancel</Button>
                      <Button color="primary" @click="destroy(tax.id)">Yes, Delete</Button>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>