<template lang="pug">
  v-card(flat).heatmap.transparent
    v-card-text
      l-map(:zoom="zoom" :center="center" @update:bounds="onBoundsUpdated" @update:center="onCenterUpdated" ref="map").leaflet-map
        l-tile-layer(:url="url")
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Prop, Watch, Vue } from "vue-property-decorator"
import { LMap, LTileLayer } from "vue2-leaflet"
import { LatLng, Map } from "leaflet"
import { Feature, Point } from "geojson"
import "leaflet.heat"

import GeoIPV4Service from "@/services/geoipv4"

export interface LeaftletBounds {
  _southWest: { lat: number; lng: number }
  _northEast: { lat: number; lng: number }
}
export interface HeatMapGradient {
  [k: number]: string
}

const geoService = new GeoIPV4Service()
const defaultGradient = { 0.15: "#00E5FF", 0.25: "#76FF03", 0.3: "#FF3D00" }

@Component({ name: "heat-map", components: { LMap, LTileLayer } })
export default class HeatMap extends Vue {
  public url: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  public zoom: number = 3
  public center: number[] = [0, 0]
  public bounds: LeaftletBounds | null = null
  public heatLayer: any = null

  @Prop({ type: Number, required: false, default: 1.0 }) private readonly max!: number
  @Prop({ type: Number, required: false, default: 0.1 }) private readonly minOpacity!: number
  @Prop({ type: Number, required: false, default: 25 }) private readonly radius!: number
  @Prop({ type: Number, required: false, default: 10 }) private readonly blur!: number
  @Prop({ type: Object, required: false, default: defaultGradient }) private readonly gradient!: HeatMapGradient

  get map(): Map {
    // @ts-ignore
    return this.$refs.map.mapObject
  }

  get heatLayerOptions(): any {
    return { minOpacity: this.minOpacity, radius: this.radius, max: this.max, blur: this.blur, gradient: this.gradient }
  }

  public async mounted() {
    // @ts-ignore
    this.heatLayer = L.heatLayer([], this.heatLayerOptions).addTo(this.map)
    this.map.locate({ setView: true, maxZoom: 9 })
    this.map.setMaxBounds([[85, -180], [-85, 180]])
    if (!_.isNil(this.bounds)) {
      this.updateHeatmap(this.bounds)
    }
  }

  @Watch("heatLayerOptions")
  private onHeatLayerOptionsUpdated(value: any) {
    this.heatLayer.setOptions(value)
  }

  private async updateHeatmap(bounds: LeaftletBounds) {
    if (!_.isNil(bounds)) {
      const response = await geoService.queryBounds({
        lat: { min: bounds._southWest.lat, max: bounds._northEast.lat },
        lon: { min: bounds._southWest.lng, max: bounds._northEast.lng },
      })
      const latlngs = _.map(response.features, (entry: Feature<Point>) => {
        return [entry.geometry.coordinates[0], entry.geometry.coordinates[1], _.get(entry.properties, "weight")]
        // return [entry.lat, entry.lng, entry.weight]
      })
      this.heatLayer.setLatLngs(latlngs)
    }
  }

  private async onBoundsUpdated(bounds: any) {
    this.bounds = bounds
    if (!_.isNil(this.bounds)) {
      this.updateHeatmap(this.bounds)
    }
    this.$emit("update:bounds", bounds)
  }

  private async onCenterUpdated(center: any) {
    this.center = center
    this.$emit("update:center", center)
  }
}
</script>

<style lang="stylus">
.heatmap
  height 100%
  width 100%
  border-radius 10px

  .v-card__text
    height 100%

    .leaflet-map
      height 100%
      border-radius 10px
</style>
