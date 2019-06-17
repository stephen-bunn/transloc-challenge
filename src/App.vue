<template lang="pug">
  v-app(:dark="dark")
    v-content
      v-container(fill-height)
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
@import "~@/assets/styles/main"
</style>
