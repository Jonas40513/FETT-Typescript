import { html, render } from "lit-html"
import "./overview-component"
import "./detail-component"
import router from "../router"
import store from "../model/store"
import produce from "immer"

const overviewComponentTemplate = html`
    <overview-component></overview-component>`

const detailComponentTemplate = (emergencyId: string) => html`
    <detail-component emergency-id=${emergencyId}></detail-component>`

class AppComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        router.on("/", () => {
            render(overviewComponentTemplate, this.shadowRoot)
        }).on("/emergency/:id", ({ data }) => {
            const nextState = produce(store.getValue(), draft => {
                draft.selected = data.id
            })
            store.next(nextState)
            render(detailComponentTemplate(data.id), this.shadowRoot)
        }).resolve()
    }
}

customElements.define("app-component", AppComponent)
