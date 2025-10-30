
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Thêm dòng này:
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
const app = createApp(App)

app.use(router)
app.component('VueGoodTable', VueGoodTable)
app.mount('#app')

