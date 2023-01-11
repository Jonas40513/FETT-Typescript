import produce from "immer"
import { Emergency } from "./model/emergency"
import store from "./model/store"
import { emergenciesUrl } from "./properties"

class EmergencyService {
    async fetchEmergencies() {
        const response = await fetch(emergenciesUrl)
        const emergencies = await response.json() as Emergency[]
        const nextState = produce(store.getValue(), draft => {
            draft.emergencies = emergencies
        })
        store.next(nextState)
    }
}

const emergencyService = new EmergencyService()
export default emergencyService
