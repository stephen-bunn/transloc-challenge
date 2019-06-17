<template lang="pug">
  div.heatmap
    l-map(:zoom="zoom" :center="center" @update:bounds="onBoundsUpdated" ref="map").leaflet-map
      l-tile-layer(:url="url")
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Prop, Vue } from "vue-property-decorator"
import { LMap, LTileLayer } from "vue2-leaflet"
import { LatLng } from "leaflet"
import "leaflet.heat"

import GeoIPV4Service from "@/services/geoipv4"

interface LeaftletBounds {
  _southWest: { lat: number; lng: number }
  _northEast: { lat: number; lng: number }
}

const geoService = new GeoIPV4Service()

@Component({ name: "heat-map", components: { LMap, LTileLayer } })
export default class HeatMap extends Vue {
  public url: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  public zoom: number = 3
  public center: number[] = [47.41322, -1.219482]
  public bounds: LeaftletBounds | null = null

  private async updateHeatmap(bounds: any) {
    let response = await geoService.queryBounds({
      lat: { min: this.bounds._southWest.lat, max: this.bounds._northEast.lat },
      lon: { min: this.bounds._southWest.lng, max: this.bounds._northEast.lng },
    })
    let data = _.map(response.data.networks, entry => {
      return [entry.latitude, entry.longitude, entry.weight]
    })
    L.heatLayer(data, { radius: 15, max: 1, blur: 15, gradient: { 0.05: "blue", 0.1: "lime", 0.2: "red" } }).addTo(
      this.$refs.map.mapObject
    )
  }

  private async onBoundsUpdated(bounds: any) {
    this.bounds = bounds
    this.updateHeatmap(this.bounds)
  }

  public mounted() {
    L.heatLayer([], { radius: 15, max: 1, blur: 15, gradient: { 0.3: "blue", 0.6: "lime", 1: "red" } }).addTo(
      this.$refs.map.mapObject
    )
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
