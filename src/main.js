import Vue from 'vue'
import Vuex from 'vuex';
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
import SimpleVueValidation from 'simple-vue-validator';
import router from './router'
import store from './store'
import axios from 'axios'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import vuetify from '@/plugins/vuetify'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueMask from 'v-mask'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Vuetify)
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(VueAxios, axios)
Vue.use(Vuelidate)
Vue.use(Vuex)
Vue.use(SimpleVueValidation);
Vue.use(VueMask);
Vue.use(Chartkick.use(Chart))

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start()
    }
    next()
})

router.afterEach(() => {
    NProgress.done()
})

axios.defaults.baseURL = process.env.VUE_APP_HOST || 'http://localhost:3000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
