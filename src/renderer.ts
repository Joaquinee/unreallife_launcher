import './index.css';
import $ from 'jquery';
import "preline/preline";

import { createApp } from 'vue';
import App from './vue/App.vue';
import router from './vue/router';

import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)
app.use(Notifications)
app.use(router)
app.mount('#app')


  


