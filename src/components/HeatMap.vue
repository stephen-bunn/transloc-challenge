<template lang="pug">
  div.heatmap
    l-map(:zoom="zoom" :center="center" @update:bounds="onBoundsUpdated").leaflet-map
      l-tile-layer(:url="url")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import { LMap, LTileLayer } from "vue2-leaflet"

interface LeaftletBounds {
  _southWest: { lat: number; lng: number }
  _northEast: { lat: number; lng: number }
}

@Component({ name: "heat-map", components: { LMap, LTileLayer } })
export default class HeatMap extends Vue {
  public url: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  public zoom: number = 3
  public center: number[] = [47.41322, -1.219482]
  public bounds: LeaftletBounds | null = null

  private onBoundsUpdated(bounds: any) {
    this.bounds = bounds
  }
}
</script>

<style lang="stylus">
.heatmap
  height 100%
  width 100%

  .leaflet-map
    height 80%
</style>
