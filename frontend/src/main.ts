import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './style.css'
import { i18n } from './locales/i18n'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.mount('#app')