import { createSSRApp } from 'vue'
import App from './App.vue'
import '../styles.css'
import './workbench.css'
export function createLapApp() {
  return createSSRApp(App)
}
if (!import.meta.env.SSR) createLapApp().mount('#app')
