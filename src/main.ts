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

// Uudelleenohjauksien käsittely (ks. 404.html)
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  router.replace(redirectPath).finally(() => {
    app.use(router);
    app.mount('#app');
  });
} else {
  app.use(router);
  app.mount('#app');
}
