import { createApp } from 'vue'
import VueCryptocurrencyIcons from '@phantasweng/vue-cryptocurrency-icons'
import App from '@/App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './style.css'


const app = createApp(App)
app.use(router)
app.use(VueCryptocurrencyIcons)
app.use(createPinia())
app.mount('#app')