import { createApp, provide } from 'vue'
import './style.css'
import App from './App.vue'
import mitt from 'mitt'

const emitter =  mitt()
provide('emitter', emitter)
createApp(App).mount('#app')
