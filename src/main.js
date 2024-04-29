import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createVuestic } from "vuestic-ui";
import VueTheMask from 'vue-the-mask'
import VueCookies from 'vue-cookies'
import "vuestic-ui/css";
import "material-design-icons-iconfont/dist/material-design-icons.min.css";
import './index.css'




createApp(App).use(VueCookies, {
    expires: '1h'
}).use(store).use(router).use(createVuestic()).use(VueTheMask).mount('#app')
