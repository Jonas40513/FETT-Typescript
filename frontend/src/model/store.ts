import { BehaviorSubject } from "rxjs"
import { Emergency } from "./emergency"

export interface Model {
    readonly emergencies: Emergency[]
}

const initialState: Model = {
    emergencies: new Array<Emergency>
}

const store = new BehaviorSubject<Model>(initialState)

export default store