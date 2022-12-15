import { html, render } from "lit-html"
import "./overview-component"
import * as L from 'leaflet';
import store from "../model/store"
import { Emergency } from "../model/emergency";
import { w3css } from "../properties"
import { getLocation } from "../model/model"

const mapComponentTemplate = html`
    <link rel="stylesheet" href=${w3css}>
    <link rel="stylesheet" href="../../res/leaflet.css">
    <div id="map" class="w3-container" style="height:100%"></div>`

class MapComponent extends HTMLElement {
    static get observedAttributes() {
        return ["emergency-id"]
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: '../../res/images/marker-icon-2x.png',
            iconUrl: '../../res/images/marker-icon.png',
            shadowUrl: '../../res/images/marker-shadow.png',
        });
    }
    attributeChangedCallback(name: string, oldValue: string, value: string) {
        this.render(store.getValue().emergencies.find((emergency) => emergency.id === value))
    }

    render(emergency: Emergency) {
        let map: L.Map;
        render(mapComponentTemplate, this.shadowRoot)
        let container = L.DomUtil.get(this.shadowRoot.getElementById("map"));
        if (!container.hasChildNodes()) {
            map = new L.Map(this.shadowRoot.getElementById("map"), {
                center: new L.LatLng(48.10, 14.24),
                zoom: 8,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            const marker = new L.Marker([emergency.latitude, emergency.longitude]);
            marker.bindPopup("<b>" + emergency.subtype + "</b><br>" + getLocation(emergency.district, emergency.location, emergency.town)).openPopup()
            marker.addTo(map);
            setInterval(function () {
                map.invalidateSize();
            }, 100);

        }
    }
}

customElements.define("map-component", MapComponent)
