
<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapWritableState } from 'pinia'
import { useAuthStore } from './stores/Auth'

export default defineComponent({
  name: 'App',

  data () {
    return {
      //
    }
  },

  computed: {
    ...mapWritableState(useAuthStore, ['loggedIn'])
  },

  methods: {
    ...mapActions(useAuthStore, ['logout']),

    async handleLogout() {
      this.logout()
      this.$router.push({ name: 'Auth/Login '})
    }
  }
})
</script>

<template>
  <v-app class="primary--text">
    <v-layout>
      <v-navigation-drawer
        v-if="loggedIn"
        expand-on-hover
        rail
        color="primary"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/81.jpg"
            title="James Allen"
            subtitle="me@james-allen.ca"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-view-dashboard" value="dashboard">
            <h3>Dashboard</h3>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-group"
            value="clients"
            :to="{ name: 'Clients/Index' }"
          >
            <h3>Clients</h3>
          </v-list-item>
          <v-list-item prepend-icon="mdi-receipt-text"
            value="invoices"
            :to="{ name: 'Invoices/Index' }"
          >
            <h3>Invoices</h3>
          </v-list-item>
          <v-list-item disabled prepend-icon="mdi-file-document" value="estimates">
            <h3>Estimates</h3>
          </v-list-item>
          <v-list-item disabled prepend-icon="mdi-cash-multiple" value="expenses">
            <h3>Expenses</h3>
          </v-list-item>
          <v-list-item disabled prepend-icon="mdi-finance" value="reports">
            <h3>Reports</h3>
          </v-list-item>
        </v-list>
        <template #append>
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-logout"
              title="Logout"
              value="logout"
              @click="handleLogout" />
          </v-list>
        </template>
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style lang="scss">
.document {
  background-color: #ffffff;
  padding: 1.5rem;

  .line-items .v-row {
    align-items: center;
    
    &:nth-child(odd) {
      background-color: #f9f9f9;
    }
  }
}

.v-application.primary--text {
  color: #9A8F99 !important;
  caret-color: #9A8F99 !important;
}

.d-print-none {
    @media print {
        display: none !important;
    }
}

@media print {
  .d-print-none,
  .v-navigation-drawer,
  .v-btn { 
    display: none !important;
  }
  body,
  .v-main,
  .v-container,
  .document {
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>
