// Renderer process code
import { createApp } from 'vue'
import AppLayout from './components/AppLayout.vue'
import router from './router'
import './types/electron'
import './styles.css'

document.addEventListener('DOMContentLoaded', () => {
  console.log('Vue app starting...')
  
  const app = createApp(AppLayout)
  app.use(router)
  app.mount('#app')
})