<script lang="ts">
import { defineComponent } from 'vue';
import { Client } from '@/classes'
import { Button, GradientContainer, TextField } from '@/components'

export default defineComponent({
  name: 'Clients/Edit',
  components: { Button, GradientContainer, TextField },
  data: (): {
    step: number,
    form: Client
  } => ({
    step: 1,
    form: new Client()
  }),
  computed: {
    ClientId(): number {
      return Number(this.$route.params.ClientId)
    }
  },
  async mounted() {
    this.form.get(this.ClientId)
  },
  methods: {
    async save() {
      try {
        const client = await this.form.save()
        this.$router.push({ name: 'Clients/Show', params: { ClientId: client.id } })
      } catch (err) {
        console.warn(err)
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
})
</script>

<template>
  <GradientContainer>
    <template #left>
      <h1>Edit Client</h1>
    </template>
    <template #right>
      <v-form @submit.prevent="save">
        <v-window v-model="step"
          height="auto"
          direction="vertical"
          hide-delimiters
          :show-arrows="false">
          <v-window-item :value="1">
            <div>
              <TextField name="name" label="Name" v-model="form.name" />
              <TextField name="email" label="Email" v-model="form.email" />
              <TextField name="phone" label="Phone" v-model="form.phone" />
              <TextField name="website" label="Website" v-model="form.website" placeholder="https://" />
              <Button @click="cancel" color="transparent">
                Cancel
              </Button>
              <Button @click="step++" color="secondary">
                Next
              </Button>
            </div>
          </v-window-item>
          <v-window-item :value="2">
            <div>
              <TextField name="line1" v-model="form.address.line1" label="Line 1" />
              <TextField name="line2" v-model="form.address.line2" label="Line 2" />
              <TextField name="city" v-model="form.address.city" label="City" />
              <TextField name="state" v-model="form.address.state" label="state" />
              <TextField name="postal" v-model="form.address.postal" label="Postal Code" />
              <TextField name="country" v-model="form.address.country" label="Country" />
              <Button color="transparent" @click="step--">Previous</Button>
              <Button type="submit" color="secondary">Save</Button>
            </div>
          </v-window-item>
        </v-window>
      </v-form>
    </template>
  </GradientContainer>
</template>