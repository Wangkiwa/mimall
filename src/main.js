import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from "axios"
import VueAxios from "vue-axios"
import VueLazyload from "vue-lazyload"
import Vuecookie from "vue-cookie"
import { Message, Pagination } from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import env from "./env"
axios.defaults.baseURL = "/api"
axios.defaults.timeout = 8000
// axios.defaults.baseURL = env.baseURL
axios.interceptors.response.use(function (response) {
  let res = response.data
  if (res.status === 0) {
    return res.data
  } else if (res.status === 10) {
    if (location.hash !== "#/index") {
      window.location.href = "/#/login"
      Message.warning("请登录！")
    }
    return Promise.reject(res)
  } else {
    Message.error(res.msg)
    return Promise.reject(res)
  }
})
Vue.use(Pagination)
Vue.use(VueAxios, axios)
Vue.use(Vuecookie)
Vue.use(VueLazyload, {
  loading: "imgs/loading-svg/loading-bars.svg",
})
Vue.config.productionTip = false
Vue.prototype.$message = Message
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app")
