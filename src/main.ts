import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Додаємо імпорт Pinia
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // Підключаємо Pinia до додатка
app.use(router)
app.mount('#app')
