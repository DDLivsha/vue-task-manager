import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/main.scss'
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
   position: POSITION.TOP_CENTER,
   timeout: 2000
})

app.mount('#app')
