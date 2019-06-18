<template lang="pug">
  v-layout(row fill-height)
    v-flex.xs2
      v-layout(column)
        span
          v-icon(left) fe-sliders
          span.title Options

        v-card.mt-4
          v-card-title.title Heat Map
          v-card-text
            v-slider(thumb-label v-model="blur" label="Blur")
            v-slider(thumb-label v-model="radius" label="Radius")
            v-slider(thumb-label v-model="minOpacity" label="Opacity")

        v-card.mt-4
          v-card-title.title Gradient
          v-card-text
            v-menu(offset-x :close-on-content-click="false" :z-index="999" :nudge-right="8" v-model="lowMenu")
              template(v-slot:activator="{ on }")
                v-slider(thumb-label :color="lowColor" v-model="lowGradient" label="Low" append-icon="fe-edit-2" @click:append="lowMenu = true")
              chrome-color(:value="lowColorPicker" @input="onLowColorUpdated")

            v-menu(offset-x :close-on-content-click="false" :z-index="999" :nudge-right="8" v-model="medMenu")
              template(v-slot:activator="{ on }")
                v-slider(thumb-label :color="medColor" v-model="medGradient" label="Med" append-icon="fe-edit-2" @click:append="medMenu = true")
              chrome-color(:value="medColorPicker" @input="onMedColorUpdated")

            v-menu(offset-x :close-on-content-click="false" :z-index="999" :nudge-right="8" v-model="highMenu")
              template(v-slot:activator="{ on }")
                v-slider(thumb-label :color="highColor" v-model="highGradient" label="High" append-icon="fe-edit-2" @click:append="highMenu = true")
              chrome-color(:value="highColorPicker" @input="onHighColorUpdated")
    v-flex.xs10
      heat-map(:blur="blur" :radius="radius" :minOpacity="opacity" :gradient="gradient")
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator"
import { Chrome as ChromeColor } from "vue-color"

import HeatMap, { HeatMapGradient } from "@/components/HeatMap.vue"

@Component({
  components: {
    HeatMap,
    "chrome-color": ChromeColor,
  },
})
export default class Home extends Vue {
  public blur: number = 12
  public radius: number = 25
  public minOpacity: number = 10

  public lowGradient: number = 15
  public lowColor: string = "#00E5FF"
  public lowMenu: boolean = false
  public medGradient: number = 25
  public medColor: string = "#76FF03"
  public medMenu: boolean = false
  public highGradient: number = 30
  public highColor: string = "#FF3D00"
  public highMenu: boolean = false

  get lowColorPicker() {
    return {
      hex: this.lowColor,
    }
  }

  get medColorPicker() {
    return {
      hex: this.medColor,
    }
  }

  get highColorPicker() {
    return {
      hex: this.highColor,
    }
  }

  get gradient(): HeatMapGradient {
    return {
      [this.lowGradient / 100.0]: this.lowColor,
      [this.medGradient / 100.0]: this.medColor,
      [this.highGradient / 100.0]: this.highColor,
    }
  }

  @Watch("highGradient")
  private onHighGradientUpdated(value: number) {
    if (value < this.medGradient) {
      this.medGradient = value
    }
  }

  private onLowColorUpdated(value: object) {
    this.lowColor = value.hex
  }

  private onMedColorUpdated(value: object) {
    this.medColor = value.hex
  }

  private onHighColorUpdated(value: object) {
    this.highColor = value.hex
  }

  @Watch("medGradient")
  private onMedGradientUpdated(value: number) {
    if (value < this.lowGradient) {
      this.lowGradient = value
    }
    if (value > this.highGradient) {
      this.highGradient = value
    }
  }

  @Watch("lowGradient")
  private onLowGradientUpdated(value: number) {
    if (value > this.medGradient) {
      this.medGradient = value
    }
  }

  get opacity(): number {
    if (this.minOpacity > 0) {
      return this.minOpacity / 100.0
    }
    return 0
  }
}
</script>
