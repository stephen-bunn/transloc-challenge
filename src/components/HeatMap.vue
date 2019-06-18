<template lang="pug">
  div.heatmap
    l-map(:zoom="zoom" :center="center" @update:bounds="onBoundsUpdated" @update:center="onCenterUpdated" ref="map").leaflet-map
      l-tile-layer(:url="url")
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Prop, Vue } from "vue-property-decorator"
import { LMap, LTileLayer } from "vue2-leaflet"
import { LatLng, Map } from "leaflet"
import "leaflet.heat"

import GeoIPV4Service from "@/services/geoipv4"

interface LeaftletBounds {
  _southWest: { lat: number; lng: number }
  _northEast: { lat: number; lng: number }
}
interface NetworkResult {
  lat: number
  lng: number
  weight: number
}

const geoService = new GeoIPV4Service()

@Component({ name: "heat-map", components: { LMap, LTileLayer } })
export default class HeatMap extends Vue {
  public url: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  public zoom: number = 3
  public center: number[] = [47.41322, -1.219482]
  public bounds: LeaftletBounds | null = null
  public minOpacity: number = 0.1
  public radius: number = 25
  public blur: number = 10
  public max: number = 1
  public heatLayer: any = null

  get map(): Map {
    // @ts-ignore
    return this.$refs.map.mapObject
  }

  get gradient(): { [k: number]: string } {
    return { 0.05: "blue", 0.1: "lime", 0.2: "red" }
  }

  get heatLayerOptions(): any {
    return { minOpacity: this.minOpacity, radius: this.radius, max: this.max, blur: this.blur, gradient: this.gradient }
  }

  public async mounted() {
    // @ts-ignore
    this.heatLayer = L.heatLayer([], this.heatLayerOptions).addTo(this.map)
    this.map.locate({ setView: true, maxZoom: 9 })
    if (!_.isNil(this.bounds)) {
      this.updateHeatmap(this.bounds)
    }
  }

  private async updateHeatmap(bounds: LeaftletBounds) {
    if (!_.isNil(bounds)) {
      const response = await geoService.queryBounds({
        lat: { min: bounds._southWest.lat, max: bounds._northEast.lat },
        lon: { min: bounds._southWest.lng, max: bounds._northEast.lng },
      })
      const latlngs = _.map(response.data.networks, (entry: NetworkResult) => {
        return [entry.lat, entry.lng, entry.weight]
      })
      this.heatLayer.setLatLngs(latlngs)
    }
  }

  private async onBoundsUpdated(bounds: any) {
    this.bounds = bounds
    if (!_.isNil(this.bounds)) {
      this.updateHeatmap(this.bounds)
    }
  }

  private async onCenterUpdated(center: any) {
    this.center = center
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
