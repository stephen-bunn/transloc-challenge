<template lang="pug">
  v-layout(row fill-height)
    v-flex.xs2
      v-layout(column)
        v-card.mt-4
          v-card-title
            span.title Heat Map
            v-tooltip(right :max-width="250" :z-index="9999")
              v-icon(slot="activator").ml-2 fe-help-circle
              span Control various values used to render the points displayed on the heatmap.
          v-card-text
            v-slider(thumb-label v-model="blur" label="Blur" data-test="blur-slider")
            v-slider(thumb-label v-model="radius" label="Radius" data-test="radius-slider")
            v-slider(thumb-label v-model="opacity" label="Opacity" data-test="opacity-slider")

        v-card.mt-4
          v-card-title.title
            span.title Gradient
            v-tooltip(right :max-width="250" :z-index="9999")
              v-icon(slot="activator").ml-2 fe-help-circle
              span Control the color gradient used to render the heatmap.
          v-card-text
            gradient-builder(@change="onGradientUpdated")

    v-flex.xs10
      heat-map(:blur="blur" :radius="radius" :minOpacity="minOpacity" :gradient="gradient")
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Watch, Vue } from "vue-property-decorator"

import GradientBuilder, { Gradient, defaultGradient } from "@/components/GradientBuilder.vue"
import HeatMap, { HeatMapGradient } from "@/components/HeatMap.vue"

// the type used for storing a cookie to persist application state between sessions
export interface HeatMapCookie {
  blur: number
  radius: number
  opacity: number
  gradient: HeatMapGradient
}

// they cookie name to use for persisting application state
export const cookiesKey = "transloc-heatmap"

@Component({ components: { HeatMap, GradientBuilder } })
export default class Home extends Vue {
  public blur: number = 12
  public radius: number = 25
  public opacity: number = 10
  public gradient: HeatMapGradient = {}

  /**
   * Home view `created` life-cycle hook.
   *
   * @public
   */
  public async created() {
    // restore application state from cookie if it exists
    const storedOptions: HeatMapCookie = this.$cookies.getJSON(cookiesKey)
    if (_.isObject(storedOptions)) {
      this.blur = storedOptions.blur
      this.radius = storedOptions.radius
      this.opacity = storedOptions.opacity
      this.gradient = storedOptions.gradient
    }
  }

  /**
   * Dump basic application state out to a cookie.
   *
   * @private
   */
  private updateCookies() {
    this.$cookies.set(cookiesKey, {
      gradient: this.gradient,
      blur: this.blur,
      radius: this.radius,
      opacity: this.opacity,
    })
  }

  /**
   * Watch for updates to the blur slider and update application state.
   *
   * @private
   */
  @Watch("blur")
  private onBlurUpdated(value: number) {
    this.updateCookies()
  }

  /**
   * Watch for updates to the radius slider and update application state.
   *
   * @private
   */
  @Watch("radius")
  private onRadiusUpdated(value: number) {
    this.updateCookies()
  }

  /**
   * Watch for updates to the opacity slider and update application state.
   *
   * @private
   */
  @Watch("opacity")
  private onOpacityUpdated(value: number) {
    this.updateCookies()
  }

  /**
   * Callback handler for when the gradient control is updated to update the application state.
   *
   * @private
   */
  private onGradientUpdated(value: Gradient[]) {
    const gradient: HeatMapGradient = {}
    _.forEach(value, (entry: Gradient) => {
      gradient[entry.value / 100.0] = entry.color
    })
    this.gradient = gradient
    this.updateCookies()
  }

  /**
   * The actual minimum opacity to use for the heatmap.
   *
   * @note Slider requires 0-100 but heatmap requires 0.0-0.1
   * @public
   * @type {number}
   */
  get minOpacity(): number {
    if (this.opacity > 0) {
      return this.opacity / 100.0
    }
    return 0
  }
}
</script>
