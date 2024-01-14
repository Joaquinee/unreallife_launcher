import './index.css';
import $ from 'jquery';
import { createApp } from 'vue';
import App from './vue/App.vue';



createApp(App).mount('#app');




const updateVersion = async () => {
    const version = await window.a3url.getVersion();
    const lastestVersion = await window.a3url.getLastestVersion();
    const textElement = document.getElementById('version');
    textElement.innerHTML = `Version actuel : ${version} - Derniere version : ${lastestVersion}`;
  };
  

updateVersion();
  


