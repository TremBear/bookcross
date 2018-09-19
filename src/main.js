import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/bbs_index.scss'/// global css
import App from './App'
import router from './router'
import store from './store'
import global_ from './utils/public'
import '@/icons' // icon
import '@/permission' // permission control

import { parseTime } from '@/utils/index'
import eventVue from '@/utils/event'
import { getToken } from '@/utils/auth'

Vue.use(ElementUI, { locale })
Vue.prototype.global = global_
Vue.prototype.getToken = getToken()
Vue.prototype.eventVue = eventVue
Vue.prototype.parseTime = parseTime
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
