<template lang="pug">
  v-layout(row fill-height)
    v-flex.xs2
      v-layout(column)
        v-card.mt-3
          v-card-title.title Heat Map
          v-card-text
            v-slider(thumb-label v-model="blur" label="Blur")
            v-slider(thumb-label v-model="radius" label="Radius")
            v-slider(thumb-label v-model="minOpacity" label="Opacity")

        v-card.mt-4
          v-card-title.title Gradient
          v-card-text
            gradient-builder(@change="onGradientUpdated")

    v-flex.xs10
      heat-map(:blur="blur" :radius="radius" :minOpacity="opacity" :gradient="gradient")
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Watch, Vue } from "vue-property-decorator"

import GradientBuilder, { Gradient } from "@/components/GradientBuilder.vue"
import HeatMap, { HeatMapGradient } from "@/components/HeatMap.vue"

@Component({
  components: {
    HeatMap,
    GradientBuilder,
  },
})
export default class Home extends Vue {
  public blur: number = 12
  public radius: number = 25
  public minOpacity: number = 10
  public gradient: HeatMapGradient = {}

  private onGradientUpdated(value: Gradient[]) {
    let gradient: HeatMapGradient = {}
    _.forEach(value, entry => {
      gradient[entry.value / 100.0] = entry.color
    })
    this.gradient = gradient
  }

  get opacity(): number {
    if (this.minOpacity > 0) {
      return this.minOpacity / 100.0
    }
    return 0
  }
}
</script>
