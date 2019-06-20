import references from "./static/references.json"
import routes from "./static/routes.json"

describe("Home", () => {

  it("can visit the home route", () => {
    cy.visit(routes.home)
    cy.wait(1000)
  })

  describe("Heatmap Options", () => {
    it("can manipulate heatmap blur", () => {
      cy.get(references.sliders.blur).as("blurSlider")
      cy.get("@blurSlider").should("be.visible")
      cy.get("@blurSlider")
        .focus()
        .type("{rightarrow}".repeat(20), {force: true})
        .type("{leftarrow}".repeat(20), {force: true})
        .blur()
    })

    it("can manipulate heatmap radius", () => {
      cy.get(references.sliders.radius).as("radiusSlider")
      cy.get("@radiusSlider").should("be.visible")
      cy.get("@radiusSlider")
        .focus()
        .type("{rightarrow}".repeat(20), {force: true})
        .type("{leftarrow}".repeat(20), {force: true})
        .blur()
    })

    it("can manipulate heatmap opacity", () => {
      cy.get(references.sliders.opacity).as("opacitySlider")
      cy.get("@opacitySlider").should("be.visible")
      cy.get("@opacitySlider")
        .focus()
        .type("{rightarrow}".repeat(20), { force: true })
        .type("{leftarrow}".repeat(20), { force: true })
        .blur()
    })
  })

  describe("Gradient Options", () => {
    it("can manipulate gradient value", () => {
      cy.get(references.sliders.firstGradient).as("gradientSlider")
      cy.get("@gradientSlider").should("be.visible")
      cy.get("@gradientSlider")
        .focus()
        .type("{rightarrow}".repeat(20), { force: true })
        .type("{leftarrow}".repeat(20), { force: true })
        .blur()
    })

    it("can add gradient entries", () => {
      cy.get(references.buttons.addGradient).as("addButton")
      cy.get("@addButton").should("be.visible")
      cy.get(references.misc.allGradients).should("have.length", 3)
      cy.get("@addButton").click()
      cy.get(references.misc.allGradients).should("have.length", 4)
    })

    it("can remove gradient entries", () => {
      cy.get(references.sliders.lastGradient).as("gradientSlider")
      cy.get("@gradientSlider").should("be.visible")
      cy.get(references.misc.allGradients).should("have.length", 4)
      cy.get(references.sliders.lastGradientIcon).children("i.v-icon").click()
      cy.get(references.misc.allGradients).should("have.length", 3)
    })
  })
})
