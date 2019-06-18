<template lang="pug">
  v-app(:dark="dark")
    v-toolbar(app flat dense)
      v-toolbar-title.headline TransLoc GeoIPv4
      v-spacer
      v-toolbar-items
        v-btn(flat tag="a" href="https://geolite.maxmind.com/download/geoip/database/GeoLite2-City-CSV.zip" target="_blank")
          v-icon(left) fe-database
          span Dataset
    v-content
      v-container(fluid fill-height)
        router-view
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"

@Component({ name: "app" })
export default class App extends Vue {
  private dark: boolean = false
}
</script>

<style lang="stylus">
@import "~@icon/feather/feather.css"
@import "~@/assets/styles/main"
</style>
