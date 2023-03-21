import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.mount('#app')
