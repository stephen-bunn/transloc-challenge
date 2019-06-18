<template lang="pug">
  v-layout(column).gradient-builder
    template(v-for="(entry, entryIdx) in gradient")
      v-menu(offset-y :key="`gradient-entry-${entryIdx}`" :close-on-content-click="false" :z-index="999" v-model="entry.menu")
        template(v-slot:activator="{ on }")
          v-slider(thumb-label :color="entry.color" v-model="entry.value" prepend-icon="fe-edit-2" append-icon="fe-x-circle" @input="(value) => onValueUpdated(entryIdx, value)" @click:prepend="entry.menu = true" @click:append="() => removeGradient(entryIdx)")
        color-picker(:value="{hex: `${entry.color}`}" @input="(value) => onColorUpdated(entryIdx, value)")
    v-flex.justify-end
      v-btn(outline block color="primary" @click="addGradient")
        span Add Color
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Watch, Vue } from "vue-property-decorator"
import { Chrome as ChromeColor } from "vue-color"

export interface Gradient {
  value: number
  color: string
  menu: boolean
}

interface ColorValue {
  a: number
  hex: string
  hex8: string
  hsl: {
    a: number,
    h: number,
    s: number,
    l: number,
  }
  hsv: {
    a: number,
    h: number,
    s: number,
    v: number,
  }
  oldHue: number
  rgba: {
    a: number,
    r: number,
    g: number,
    b: number,
  }
  source: string
}

export const defaultGradient: Gradient[] = [
  { value: 15, color: "#00E5FF", menu: false },
  { value: 25, color: "#76FF03", menu: false },
  { value: 30, color: "#FF3D00", menu: false },
]

@Component({ name: "gradient-builder", components: { "color-picker": ChromeColor } })
export default class GradientBuilder extends Vue {
  public gradient: Gradient[] = defaultGradient

  public async mounted() {
    this.$emit("change", this.gradient)
  }

  public onColorUpdated(entryIdx: number, value: ColorValue) {
    this.gradient[entryIdx].color = value.hex
  }

  public onValueUpdated(entryIdx: number, value: number) {
    _.forEach(_.range(entryIdx), (lowIdx: number) => {
      if (this.gradient[lowIdx].value > value) {
        this.gradient[lowIdx].value = value
      }
    })
    _.forEach(_.range(entryIdx + 1, _.size(this.gradient)), (highIdx: number) => {
      if (this.gradient[highIdx].value < value) {
        this.gradient[highIdx].value = value
      }
    })
  }

  public removeGradient(entryIdx: number) {
    this.gradient.splice(entryIdx, 1)
  }

  public addGradient() {
    this.gradient.push({ value: 100, color: "#212121", menu: false })
  }

  @Watch("gradient", { deep: true })
  private onGradientUpdated(value: Gradient[]) {
    this.$emit("change", value)
  }
}
</script>
