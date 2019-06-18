<template lang="pug">
  v-layout(row fill-height)
    v-flex.xs2
      v-layout(column)
        v-card.mt-3
          v-card-title.title Heat Map
          v-card-text
            v-slider(thumb-label v-model="blur" label="Blur")
            v-slider(thumb-label v-model="radius" label="Radius")
            v-slider(thumb-label v-model="opacity" label="Opacity")

        v-card.mt-4
          v-card-title.title Gradient
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

export interface HeatMapCookie {
  blur: number
  radius: number
  opacity: number
  gradient: HeatMapGradient
}

export const cookiesKey = "transloc-heatmap"

@Component({
  components: {
    HeatMap,
    GradientBuilder,
  },
})
export default class Home extends Vue {
  public blur: number = 12
  public radius: number = 25
  public opacity: number = 10
  public gradient: HeatMapGradient = {}

  public async created() {
    let storedOptions: HeatMapCookie = this.$cookies.getJSON(cookiesKey)
    if (_.isObject(storedOptions)) {
      this.blur = storedOptions.blur
      this.radius = storedOptions.radius
      this.opacity = storedOptions.opacity
      this.gradient = storedOptions.gradient
    }
  }

  private updateCookies() {
    this.$cookies.set(cookiesKey, {
      gradient: this.gradient,
      blur: this.blur,
      radius: this.radius,
      opacity: this.opacity,
    })
  }

  @Watch("blur")
  private onBlurUpdated(value: number) {
    this.updateCookies()
  }

  @Watch("radius")
  private onRadiusUpdated(value: number) {
    this.updateCookies()
  }

  @Watch("opacity")
  private onOpacityUpdated(value: number) {
    this.updateCookies()
  }

  private onGradientUpdated(value: Gradient[]) {
    let gradient: HeatMapGradient = {}
    _.forEach(value, (entry: Gradient) => {
      gradient[entry.value / 100.0] = entry.color
    })
    this.gradient = gradient
    this.updateCookies()
  }

  get minOpacity(): number {
    if (this.opacity > 0) {
      return this.opacity / 100.0
    }
    return 0
  }
}
</script>
