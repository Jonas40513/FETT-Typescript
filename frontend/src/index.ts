import "./components/app-component"
import { publicServerKey, subscribeUrl, w3css } from "./properties"
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

async function subscribe() {
    const sw = await navigator.serviceWorker.ready
    const push = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicServerKey
    })
    await fetch(subscribeUrl, {
        method: "POST",
        body: JSON.stringify(push),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

if ("serviceWorker" in navigator) {
    addEventListener("load", async () => {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" })
    })
}

if (!(Notification.permission === "denied" || Notification.permission === "default")) {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            subscribe()
        }
    })
}
else {
    subscribe()
}
