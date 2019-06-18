import Vue from "vue"
import Cookies from "js-cookie"

Vue.use({
  install: (v: any) => {
    v.prototype.$cookies = Cookies
  },
})
