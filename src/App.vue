<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useAppStore, useAuthStore } from './stores'
import { Avatar } from './components'

export default defineComponent({
  name: 'App',
  components: { Avatar },
  data: () => ({
    open: false
  }),
  computed: {
    ...mapWritableState(useAuthStore, ['loggedIn']),
    ...mapState(useAppStore, ['navOpen']),
    showNav: {
      get(): boolean {
        return this.$vuetify.display.mdAndUp || this.navOpen
      },
      set(value: boolean) {
        this.open = value
      }
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
    ...mapActions(useAppStore, ['toggleNav']),
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
        :rail="$vuetify.display.mdAndUp"
        expand-on-hover
        color="primary"
        v-model="showNav"
        @update:model-value="toggleNav"
        mobile-breakpoint="md">
        <v-list>
          <v-list-item
            title="Freebooks Ltd."
            subtitle="me@james-allen.ca"
          >
            <template #prepend>
              <Avatar name="James Allen" class="ml-n2" />
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-view-dashboard"
            value="dashboard"
            :to="{ name: 'Dashboard' }"  
          >
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
          <v-list-item prepend-icon="mdi-logout" value="logout" @click="handleLogout">
            <h3>Logout</h3>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

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

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .v-main > .v-container {
    padding: 0.5rem;
  }
}

.d-print-none {
    @media print {
        display: none !important;
    }
}

@media print {
  .d-print-none,
  .v-navigation-drawer,
  .v-btn,
  .v-overlay-container { 
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
