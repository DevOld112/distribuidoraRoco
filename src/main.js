import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firebase'

import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config'

import App from './App.vue'
import router from './router'
import { useToast } from 'vue-toast-notification'
import "vue-toast-notification/dist/theme-sugar.css";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faStore, faBookOpen, faDroplet, faSnowflake } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'

// Añade los iconos que necesitas a la librería
library.add(faUser, faEnvelope, faFacebook, faTwitter, faInstagram, faStore, faBookOpen, faDroplet, faSnowflake)



const $toast = useToast({
    duration: 3000,
    position: 'top-right'
})

const app = createApp(App)

app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
})

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VueSweetalert2);
app.use(createPinia())
app.use(plugin, defaultConfig(config))
app.use(router)
app.provide('toast', $toast)

app.mount('#app')
