import { html, render } from "lit-html"

import store from "../model/store"
import { Emergency } from "../model/emergency"
import { getFormattedDate, getLocation, getIcon } from "../model/model"
import { w3css } from "../properties"
import "../i18next"
import i18next from "i18next"
import router from "../router"

const tableTemplate = html`
    <link rel="stylesheet" href=${w3css}>
    <table class="w3-table w3-striped w3-bordered">
        <thead>
            <tr>
                <th>${i18next.t('emergencyType')}</th>
                <th>${i18next.t('title')}</th>
                <th>${i18next.t('date')}</th>
                <th>${i18next.t('place')}</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>`

const rowTemplate = (emergency: Emergency) => html`
    <td><img src=${getIcon(emergency.type)}/></td>
    <td>${emergency.subtype}</td>
    <td>${getFormattedDate(emergency.start, emergency.end)}</td>
    <td>${getLocation(emergency.district, emergency.location, emergency.town)}</td>`

class OverviewComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        store.subscribe(model => this.render(model.emergencies))
    }

    private render(emergencies: Emergency[]) {
        render(tableTemplate, this.shadowRoot)
        const tBody = this.shadowRoot.querySelector("tbody")
        emergencies.forEach(emergency => {
            const row = tBody.insertRow()
            row.onclick = () => {
                router.navigate(`/emergency/${emergency.id}`)
            }
            row.classList.add("w3-hover-opacity")
            render(rowTemplate(emergency), row)
        })
    }
}

customElements.define("overview-component", OverviewComponent)
