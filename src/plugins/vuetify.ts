// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@/styles/main.scss'

// Vuetify
import { ThemeDefinition, createVuetify, defaults as vuetifyDefaults } from 'vuetify'

const fbTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#EFEFEF',
    'on-background': '#ffffff',
    surface: '#ffffff',
    'on-surface': '#9A8F99',
    primary: '#FE6D73',
    'on-primary': '#ffffff',
    secondary: '#17C3B2',
    'on-secondary': '#ffffff',
    tertiary: '#56CBF9',
    'on-tertiary': '#ffffff',
    info: '#227C9D',
    'on-info': '#ffffff'
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'fbTheme',
    themes: { fbTheme },
    icons: {
      defaultSet: 'mdi'
    }
  }
})
