<template lang="pug">
  v-card(flat).heatmap.transparent
    v-card-text
      v-progress-linear(indeterminate query :active="loading").ma-0
      l-map(:zoom="zoom" :center="center" @update:bounds="onBoundsUpdated" @update:center="onCenterUpdated" ref="map").leaflet-map
        l-tile-layer(:url="url")
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Prop, Watch, Vue } from "vue-property-decorator"
import { LMap, LTileLayer } from "vue2-leaflet"
import { LatLng, Map } from "leaflet"
import { Feature, Point } from "geojson"
import { debounce } from "helpful-decorators"
import "leaflet.heat"

import GeoIPV4Service from "@/services/geoipv4"

// the bounding box type that leaflet exposes from vue-leaflet
export interface LeaftletBounds {
  _southWest: { lat: number; lng: number }
  _northEast: { lat: number; lng: number }
}

// the overall type used for describing the heatmap gradient
export interface HeatMapGradient {
  [k: number]: string
}

const geoService = new GeoIPV4Service()

// default values for map center and heatmap gradients
const defaultCenter: [number, number] = [35.762672, -78.406677]
const defaultGradient = { 0.15: "#00E5FF", 0.25: "#76FF03", 0.3: "#FF3D00" }


@Component({ name: "heat-map", components: { LMap, LTileLayer } })
export default class HeatMap extends Vue {
  public url: string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  public zoom: number = 3
  public center: number[] = [0, 0]
  public bounds: LeaftletBounds | null = null
  public heatLayer: any = null
  private loading: boolean = false

  /**
   * The maximum value to use for modifying the heatmap gradient intensity.
   */
  @Prop({ type: Number, required: false, default: 1.0 })
  private readonly max!: number

  /**
   * The minimum opacity of the heatmap gradient.
   */
  @Prop({ type: Number, required: false, default: 0.1 })
  private readonly minOpacity!: number

  /**
   * The radius of the heatmap points.
   */
  @Prop({ type: Number, required: false, default: 25 })
  private readonly radius!: number

  /**
   * The amount of blur to apply the the heatmap point intersections.
   */
  @Prop({ type: Number, required: false, default: 10 })
  private readonly blur!: number

  /**
   * The color gradient to use in the heatmap.
   */
  @Prop({ type: Object, required: false, default: defaultGradient })
  private readonly gradient!: HeatMapGradient


  /**
   * The rendered Leaflet map object.
   */
  get map(): Map {
    // NOTE: required ts-ignore since leaflet type bindings are incompatible with vue's $refs
    // @ts-ignore
    return this.$refs.map.mapObject
  }

  /**
   * The `leaflet.heat` configuration options.
   */
  get heatLayerOptions(): any {
    return { minOpacity: this.minOpacity, radius: this.radius, max: this.max, blur: this.blur, gradient: this.gradient }
  }

  /**
   * HeatMap `mounted` life-cycle hook
   *
   * @public
   */
  public async mounted() {
    // NOTE: Required ts-ignore as `L` is a UMD global which is unhandled by vue's types
    // we could override this in `globals.d.ts`
    // @ts-ignore
    this.heatLayer = L.heatLayer([], this.heatLayerOptions).addTo(this.map)
    this.map.locate({ setView: true, maxZoom: 9 })
    this.map.setMinZoom(3)
    this.map.setMaxBounds([[85, -180], [-85, 180]])
    if (_.isNil(this.bounds)) {
      this.map.setView(defaultCenter, 10)
    }
    if (!_.isNil(this.bounds)) {
      this.updateHeatmap(this.bounds)
    }
  }

  /**
   * Watch for any dynamic updates to the heat layer options and update the heatmap style.
   *
   * @private
   */
  @Watch("heatLayerOptions")
  private onHeatLayerOptionsUpdated(value: any) {
    this.heatLayer.setOptions(value)
  }

  /**
   * Request new points and update the heatmap based on the input of `bounds`.
   *
   * @private
   * @param {LeafletBounds} bounds The bounding box used to discover points
   */
  @debounce(1000)
  private async updateHeatmap(bounds: LeaftletBounds) {
    if (!_.isNil(bounds)) {
      this.loading = true
      const response = await geoService.queryBounds({
        lat: { min: bounds._southWest.lat, max: bounds._northEast.lat },
        lon: { min: bounds._southWest.lng, max: bounds._northEast.lng },
      })
      const latlngs = _.map(response.features, (entry: Feature<Point>) => {
        return [entry.geometry.coordinates[0], entry.geometry.coordinates[1], _.get(entry.properties, "weight")]
      })
      // NOTE: required ts-ingore since Leaflet's types doesn't include `attributionControl`
      // @ts-ignore
      this.map.attributionControl.setPrefix(`Rendering ${_.size(latlngs)} points`)
      this.heatLayer.setLatLngs(latlngs)
      this.loading = false
    }
  }

  /**
   * Callback handler that updates the heatmap when Leaflet's bounds are updated.
   *
   * @private
   * @event update:bounds
   * @type {LeafletBounds}
   */
  private async onBoundsUpdated(bounds: any) {
    this.bounds = bounds
    if (!_.isNil(this.bounds)) {
      this.updateHeatmap(this.bounds)
    }
    this.$emit("update:bounds", bounds)
  }

  /**
   * Re-emit the `update:center` event produced by Leaflet.
   *
   * @private
   * @event update:center
   * @type {number[]}
   */
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

    .v-progress-linear
      border-radius 10px

    .leaflet-map
      height 100%
      border-radius 10px
</style>
