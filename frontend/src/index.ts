import "./components/app-component"
import { w3css } from "./properties"

const head = document.querySelector("head")
const link = document.createElement("link")
link.rel = "stylesheet"
link.href = w3css
head.appendChild(link)

const body = document.querySelector("body")
const appComponent = document.createElement("map-component")
body.appendChild(appComponent)
