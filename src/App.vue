<template lang="pug">
  v-app(:dark="dark")
    v-toolbar(app flat)
      v-toolbar-title TransLoc Challenge
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
