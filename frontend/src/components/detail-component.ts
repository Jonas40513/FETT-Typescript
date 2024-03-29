import { html, render } from "lit-html"

import store from "../model/store"
import { Emergency } from "../model/emergency"
import { getFormattedDate, getLocation, getDepartments } from "../model/model"
import { w3css } from "../properties"
import "./map-component"
import i18next from "../i18next"
import router from "../router"
import { distinctUntilChanged, map } from "rxjs"


const tableTemplate = (emergency: Emergency) => html`
        <link rel="stylesheet" href=${w3css}>
        <div id="details" style="display: grid;
                                height: 100vh;
                                grid-template-rows: 0.1fr 1fr 1fr;"
                                >
            <div>
                <button id="backBtn" class="w3-btn w3-red w3-hover-opacity" @click=${() => router.navigate("/")}>&laquo; ${i18next.t('back')}</button>
            </div>
            <table class="w3-table w3-striped w3-bordered">
                <tbody></tbody>
            </table>
            <map-component emergency-id="${emergency.id}"></map-component>
        </div>
    `

const rowTemplate = (emergency: Emergency) => html`
    <tr><th>${i18next.t("id")}</th><td>${emergency.id}</td></tr>
    <tr><th>${i18next.t("date")}</th><td>${getFormattedDate(emergency.start, emergency.end)}</td></tr>
    <tr><th>${i18next.t("level")}</th><td>${emergency.level}</td></tr>
    <tr><th>${i18next.t("emergencyType")}</th><td>${emergency.subtype}</td></tr>
    <tr><th>${i18next.t("place")}</th><td>${getLocation(emergency.district, emergency.location, emergency.town)}</td></tr>
    <tr><th>${i18next.t("departments")}</th><td>${getDepartments(emergency.departments)}</td></tr>`

class DetailComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        store.pipe(
            map(model => model.emergencies.find((emergency) => emergency.id == store.getValue().selected)),
            distinctUntilChanged()
        ).subscribe(emergency => this.render(emergency))
    }

    private render(emergency: Emergency) {
        if (emergency === undefined) {
            return
        }
        render(tableTemplate(emergency), this.shadowRoot)

        const tBody = this.shadowRoot.querySelector("tbody")
        render(rowTemplate(emergency), tBody)
    }
}

customElements.define("detail-component", DetailComponent)
