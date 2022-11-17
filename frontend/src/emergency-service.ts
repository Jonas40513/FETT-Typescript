import produce from "immer"
import store from "./model/store"
import { url } from "./properties"


class EmergencyService {
    async fetchEmergencies() {
        const response = await fetch(url)
        const emergencies = await response.json()
        const nextState = produce(store.getValue(), draft => draft.emergencies = emergencies)
        store.next(nextState)
    }
}

const emergencyService = new EmergencyService()
export default emergencyService