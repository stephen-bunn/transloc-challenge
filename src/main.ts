import Vue from "vue"
import App from "@/App.vue"
import router from "@/router"
import store from "@/store"

import "@/plugins/vuetify"

// reference leaflet styles on the application
import "leaflet/dist/leaflet.css"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h: any) => h(App),
}).$mount("#app")
