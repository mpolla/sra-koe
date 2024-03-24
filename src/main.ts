import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import router from './router'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
