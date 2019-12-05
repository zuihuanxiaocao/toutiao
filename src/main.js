import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
// 引入重置样式
import '@/styles/reset.less'

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
