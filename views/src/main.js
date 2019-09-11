// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '../static/iconfont/iconfont.css'
import store from "./store"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'wowjs/css/libs/animate.css'
// import WOW from 'wowjs'
// import '../static/module/highlight.js/styles/googlecode.css'
// import hljs from 'highlight.js'
Vue.config.productionTip = false
Vue.$http = axios
Vue.$messageAlet = ElementUI.Message
// console.log(ElementUI)
Vue.use(ElementUI)
Vue.use(mavonEditor)

//封装成一个指令
// Vue.directive('highlight', (el) => {
//   let blocks = el.querySelectorAll('pre code')
//   blocks.forEach((block) => {
//     hljs.highlightBlock(block)
//   })
// })


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
