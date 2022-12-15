import { html, render } from "lit-html"

import store from "../model/store"
import { Emergency } from "../model/emergency"
import { getFormattedDate, getLocation, getDepartments } from "../model/model"
import { w3css } from "../properties"
import "./map-component"

const tableTemplate = (emergency: Emergency) => html`
        <link rel="stylesheet" href=${w3css}>
        <div id="details" style="display: grid;
                                height: 100vh;
                                grid-template-rows: 1fr 1fr;"
                                >
            <table class="w3-table w3-striped w3-bordered">
                <tbody></tbody>
            </table>
            <map-component emergency-id="${emergency.id}"></map-component>
        </div>
    `

const rowTemplate = (emergency: Emergency) => html`
    <tr><th>Einsatznummer</th><td>${emergency.id}</td></tr>
    <tr><th>Datum</th><td>${getFormattedDate(emergency.start, emergency.end)}</td></tr>
    <tr><th>Alarmstufe</th><td>${emergency.level}</td></tr>
    <tr><th>Einsatzart</th><td>${emergency.type}</td></tr>
    <tr><th>Ort</th><td>${getLocation(emergency.district, emergency.location, emergency.town)}</td></tr>
    <tr><th>Feuerwehren</th><td>${getDepartments(emergency.departments)}</td></tr>`

class DetailComponent extends HTMLElement {
    static get observedAttributes() {
        return ["emergency-id"]
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    attributeChangedCallback(name: string, oldValue: string, value: string) {
        this.render(store.getValue().emergencies.find((emergency) => emergency.id == value))
    }

    private render(emergency: Emergency) {
        render(tableTemplate(emergency), this.shadowRoot)
        const tBody = this.shadowRoot.querySelector("tbody")
        render(rowTemplate(emergency), tBody)
    }
}

customElements.define("detail-component", DetailComponent)
