import { html, render } from "lit-html"

import store from "../model/store"
import { Emergency } from "../model/emergency"
import emergencyService from "../emergency-service"
import { getDepartments, getFormattedDate, getLocation, getIcon } from "../model/model"

const tableTemplate = html`
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <table class="w3-table w3-striped w3-bordered">
        <thead>
            <tr>
            <th>Einsatzart</th><th>Titel</th><th>Datum</th><th>Ort</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
`
const rowTemplate = (emergency: Emergency) => html`
    <td><img src=${getIcon(emergency.type)}/></td><td>${emergency.subtype}</td><td>${getFormattedDate(emergency.start, emergency.end)}</td><td>${getLocation(emergency.location, emergency.town, emergency.district)}</td>
`
class OverviewComponent extends HTMLElement {
    private root: ShadowRoot
    constructor() {
        super()
        this.root = this.attachShadow({ mode: "closed" })
    }
    async connectedCallback() {
        store.subscribe(model => this.render(model.emergencies))
        emergencyService.fetchEmergencies()
    }
    private render(emergencies: Emergency[]) {
        render(tableTemplate, this.root)
        const body = this.root.querySelector("tbody")
        emergencies.forEach(emergency => {
            const row = body.insertRow()
            row.onclick = () => {
                const event = new CustomEvent("emergency-selected", { detail: { emergency: emergency } })
                this.dispatchEvent(event)
            }
            render(rowTemplate(emergency), row)
        })
    }
}
customElements.define("overview-component", OverviewComponent)