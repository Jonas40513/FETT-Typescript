import { html, render } from "lit-html"

import store from "../model/store"
import { Emergency } from "../model/emergency"
import { getFormattedDate, getLocation, getDepartments } from "../model/model"
import { w3css } from "../properties"
import i18next from "../i18next"
const tableTemplate = html`
    <link rel="stylesheet" href=${w3css}>
    <table class="w3-table w3-striped w3-bordered">
        <tbody></tbody>
    </table>`

const rowTemplate = (emergency: Emergency) => html`
    <tr><th>${i18next.t('id')}</th><td>${emergency.id}</td></tr>
    <tr><th>${i18next.t('date')}</th><td>${getFormattedDate(emergency.start, emergency.end)}</td></tr>
    <tr><th>${i18next.t('level')}</th><td>${emergency.level}</td></tr>
    <tr><th>${i18next.t('emergencyType')}</th><td>${emergency.type}</td></tr>
    <tr><th>${i18next.t('place')}</th><td>${getLocation(emergency.district, emergency.location, emergency.town)}</td></tr>
    <tr><th>${i18next.t('departments')}</th><td>${getDepartments(emergency.departments)}</td></tr>`

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
        render(tableTemplate, this.shadowRoot)
        const tBody = this.shadowRoot.querySelector("tbody")
        render(rowTemplate(emergency), tBody)
    }
}

customElements.define("detail-component", DetailComponent)
