<template lang="pug">
  v-layout(column fill-height).home
    heat-map
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
// import HelloWorld from "@/components/HelloWorld.vue" // @ is an alias to /src

import HeatMap from "@/components/HeatMap.vue"

@Component({
  components: {
    HeatMap,
  },
})
export default class Home extends Vue {}
</script>
