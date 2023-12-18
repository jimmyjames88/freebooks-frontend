<script lang="ts">
import { defineComponent } from 'vue'
import API from '@/api'
import { Avatar, Button } from '@/components'

export default defineComponent({
  name: 'Invoices/Show',
  components: { Avatar, Button },
  data: () => ({
    client: {
      name: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal: '',
        country: ''
      },
      phone: '',
      website: '',
    },
    lineItems: [] as {
      type: string,
      description: string,
      rate: number,
      quantity: number
    }[],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: '',
    refNo: '',
    date: null
  }),
  mounted() {
    API.invoices.show(this.$route.params.invoiceId)
      .then((response: AxiosResponse) => {
        const { client, lineItems, total, notes, refNo, date } = response.data
        this.client = client
        this.lineItems = lineItems
        this.total = total
        this.notes = notes
        this.refNo = refNo
        this.date = date
      })
      .catch((err: Error) => console.warn(err))
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="v-col-auto">
        <h1>
          {{ client.name }}
          <Avatar>{{ client.name }}</Avatar>
        </h1>
        <h2># {{ refNo }}</h2>
      </v-col>
      <v-col align="end">
        <Button color="primary" disabled>
          <v-icon>mdi-printer</v-icon> Print
        </Button>
        <Button color="primary" disabled>
          <v-icon>mdi-email</v-icon> Send
        </Button>
      </v-col>
    </v-row>
    <div class="document">
      <v-row>
        <v-col>
          <h1 class="title">FreeBooks</h1>
        </v-col>
        <v-col align="end">
          <h1 class="title">Invoice</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>{{ client.address?.line1 }}</p>
          <p>{{ client.address?.line2 }}</p>
          <p>{{ client.address?.city }}</p>
          <p>{{ client.address?.state }}</p>
          <p>{{ client.address?.postal }}</p>
          <p>{{ client.address?.country }}</p>
        </v-col>
        <v-col>
          <p>#{{ refNo }}</p>
          <p>&nbsp;</p>
          <p>
            <strong>Issued: </strong>{{ date }}
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>{{ date }}</p>
          <p>{{ refNo }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-row v-for="(item, index) in lineItems" :key="`item-${index}`">
            <v-col cols="6">{{ item.description }}</v-col>
            <v-col cols="2">{{ item.quantity }}</v-col>
            <v-col cols="2">{{ item.rate }}</v-col>
            <v-col cols="2">{{ item.quantity * item.rate }}</v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>{{ notes }}</v-col>
        <v-col>
          <p>{{ subtotal }}</p>
          <p>{{ tax }}</p>
          <p>{{ total }}</p>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
.document {
  background-color: #ffffff;
  padding: 0.5in 1in;
}
</style>