import Vue from "vue"
import { CookiesStatic } from "js-cookie"

declare module "vue/types/vue" {
  interface Vue {
    $cookies: CookiesStatic<object>
  }
}
