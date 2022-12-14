import "./components/app-component"
import { w3css } from "./properties"
import "./model/store"
import emergencyService from "./emergency-service"

const head = document.querySelector("head")
const link = document.createElement("link")
link.rel = "stylesheet"
link.href = w3css
head.appendChild(link)

const body = document.querySelector("body")
const appComponent = document.createElement("app-component")
body.appendChild(appComponent)

emergencyService.fetchEmergencies()
