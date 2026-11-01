import { createSSRApp } from 'vue'
import App from './App.vue'
import './styles.css'

// The build and browser share the same deterministic component tree.
export function createPortfolioApp() {
  return createSSRApp(App)
}

if (!import.meta.env.SSR) createPortfolioApp().mount('#app')
