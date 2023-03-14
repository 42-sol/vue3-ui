import './style.css';

import { createApp } from 'vue';
import App from './App.vue';
import componentsInstaller from './components/main';

createApp(App)
    .use(componentsInstaller)
    .mount('#app');
