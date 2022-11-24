import { html, render } from "lit-html"
import "./overview-component"
import "./detail-component"
const appComponentTemplate = html`
    <overview-component id="table"></overview-component>
    <detail-component id="detail"></detail-component>`

class AppComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        this.render()

    }
    render() {
        render(appComponentTemplate, this.shadowRoot)
        const overviewComponent = this.shadowRoot.getElementById("table")
        const detailComponent: HTMLElement = this.shadowRoot.getElementById("detail")
        overviewComponent.addEventListener("emergency-selected", (e: CustomEvent) => {
            const emergencyId = e.detail.emergencyId
            detailComponent.setAttribute("emergency-id", emergencyId)
            overviewComponent.style.display = "none"
            detailComponent.style.display = "block"
        })
    }
}

customElements.define("app-component", AppComponent)
