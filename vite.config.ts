import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
		vuetify({ autoImport: true, styles: { configFile: 'src/styles/variables.scss' } })
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		server: {
			deps: {
				inline: ['vuetify']
			}
		},
		coverage: {
			reportsDirectory: ''
    },
	}
})
