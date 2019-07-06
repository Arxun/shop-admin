import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";

import "./assets/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;

import axios from "axios"

Vue.prototype.$http = axios

axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

//请求拦截
//说明：因为只要是axios发送的请求，都会执行请求拦截器中的代码
// 所以，可以在请求拦截器中，一次性添加请求头
axios.interceptors.request.use(config => {
  // 统一添加 Authorization 请求头
  config.headers.Authorization = localStorage.getItem('token')
  // 一定要返回 config
  return config
})


axios.interceptors.response.use(response => {

if(response.data.meta.status === 401){
  router.push("/login")
}
  return response
})
//注册一个导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
    return;
  }

  if (localStorage.getItem("token")) {
    next()
  } else {
    router.push("/login")
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
