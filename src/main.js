
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
const app = createApp(App)

app.use(router)
app.component('VueGoodTable', VueGoodTable)
app.mount('#app')

if (window.CKEDITOR) {
  CKEDITOR.on('instanceReady', function (evt) {
    const editor = evt.editor;

    try {
      editor.removePlugin && editor.removePlugin('update');
    } catch (e) {
  
    }

    const style = document.createElement('style');
    style.innerHTML = `.cke_notification_warning { display: none !important; }`;
    document.head.appendChild(style);
  });
}