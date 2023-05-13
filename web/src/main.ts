import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/stores'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })

const authStore = useAuthStore()
axios.defaults.baseURL = ''
axios.interceptors.request.use((config) => {
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

app.mount('#app')
