<template lang="pug">
  v-layout(column).gradient-builder
    template(v-for="(entry, entryIdx) in gradient")
      v-menu(offset-y :key="`gradient-entry-${entryIdx}`" :close-on-content-click="false" :z-index="999" v-model="entry.menu")
        template(v-slot:activator="{ on }")
          v-slider(
            thumb-label
            prepend-icon="fe-edit-2"
            append-icon="fe-x-circle"
            data-test="gradient-slider"
            :color="entry.color"
            v-model="entry.value"
            @input="(value) => onValueUpdated(entryIdx, value)"
            @click:prepend="entry.menu = true"
            @click:append="() => removeGradient(entryIdx)"
          )
        color-picker(:value="{hex: `${entry.color}`}" @input="(value) => onColorUpdated(entryIdx, value)")
    v-flex.justify-end
      v-btn(outline block color="primary" data-test="add-gradient-button" @click="addGradient")
        span Add Color
</template>

<script lang="ts">
import _ from "lodash"
import { Component, Watch, Vue } from "vue-property-decorator"
import { Chrome as ChromeColor } from "vue-color"

// the type used for storing the metadata of working gradient sliders
export interface Gradient {
  value: number
  color: string
  menu: boolean
}

// the result color type provided by vue-color
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

// the default gradient used for the gradient builder
export const defaultGradient: Gradient[] = [
  { value: 15, color: "#00E5FF", menu: false },
  { value: 25, color: "#76FF03", menu: false },
  { value: 30, color: "#FF3D00", menu: false },
]
// the default color of new gradient items
export const defaultColor = "#212121"

@Component({ name: "gradient-builder", components: { "color-picker": ChromeColor } })
export default class GradientBuilder extends Vue {
  public gradient: Gradient[] = defaultGradient

  /**
   * GradientBuilder `mounted` life-cycle hook.
   *
   * @public
   * @event change
   * @type {Gradient[]}
   */
  public async mounted() {
    this.$emit("change", this.gradient)
  }

  /**
   * Callback handler for when the color of gradients are updated.
   *
   * @public
   * @param {number} entryIdx The index of the gradient item that was updated
   * @param {ColorValue} value The new color value of the gradient item
   */
  public onColorUpdated(entryIdx: number, value: ColorValue) {
    this.gradient[entryIdx].color = value.hex
  }

  /**
   * Callback handler for when the value of gradients are updated.
   *
   * @public
   * @param {number} entryIdx The index of the gradient item that was updated
   * @param {number} value The new intensity value of the gradient item
   */
  public onValueUpdated(entryIdx: number, value: number) {

    // update lower intensity gradients below the updated gradient
    _.forEach(_.range(entryIdx), (lowIdx: number) => {
      if (this.gradient[lowIdx].value > value) {
        this.gradient[lowIdx].value = value
      }
    })

    // update higher intensity gradients above the updated gradient
    _.forEach(_.range(entryIdx + 1, _.size(this.gradient)), (highIdx: number) => {
      if (this.gradient[highIdx].value < value) {
        this.gradient[highIdx].value = value
      }
    })
  }

  /**
   * Removes a gradient item given its index.
   *
   * @public
   * @param {number} entryIdx The index of the gradient item to remove
   */
  public removeGradient(entryIdx: number) {
    this.gradient.splice(entryIdx, 1)
  }

  /**
   * Adds a new gradient item at the end of the `gradient` array.
   *
   * @public
   */
  public addGradient() {
    this.gradient.push({ value: 100, color: defaultColor, menu: false })
  }

  /**
   * Watch for updates to the gradient array and push change events out.
   *
   * @private
   * @event change
   * @type {Gradient[]}
   */
  @Watch("gradient", { deep: true })
  private onGradientUpdated(value: Gradient[]) {
    this.$emit("change", value)
  }
}
</script>
