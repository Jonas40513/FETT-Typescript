import { html, render } from "lit-html"
import "./overview-component"

const appComponentTemplate = html`
    <overview-component id="table"></overview-component>`

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
    }
}

customElements.define("app-component", AppComponent)