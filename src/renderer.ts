import './index.css';
import $ from 'jquery';
import "preline/preline";
import { createApp } from 'vue';
import App from './vue/App.vue';
import router from './vue/router';


//createApp(App).mount('#app');
const app = createApp(App)
app.use(router)
app.mount('#app')


  


