import { html, render } from "lit-html"
import "./overview-component"
import * as L from 'leaflet';
import store from "../model/store"
import { Emergency } from "../model/emergency";
import emergencyService from "../emergency-service";

const mapComponentTemplate = html`
    <link rel="stylesheet" href="./node_modules/leaflet/dist/leaflet.css">
    <div id="map" style="width: 100%;height: 60vh"></div>`

class MapComponent extends HTMLElement {
    static get observedAttributes() {
        return ["index"]
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        emergencyService.fetchEmergencies()
        store.subscribe(model => this.render(model.emergencies[index]))

    }
    render(emergency: Emergency) {
        let map: L.Map;
        render(mapComponentTemplate, this.shadowRoot)
        var container = L.DomUtil.get(this.shadowRoot.getElementById("map"));
        if (!container.hasChildNodes()) {
            map = new L.Map(this.shadowRoot.getElementById("map"), {
                center: new L.LatLng(48.10, 14.24),
                zoom: 8,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            if (emergency != null) {
                const marker = new L.Marker([emergency.latitude, emergency.longitude]);
                marker.addTo(map);
                setInterval(function () {
                    map.invalidateSize();
                }, 100);
            }
        }
    }
}

customElements.define("map-component", MapComponent)
