import { BehaviorSubject } from "rxjs"
import { Emergency } from "./emergency"

export interface Model {
    readonly emergencies: Emergency[],
    readonly selected: string
}

const initialState: Model = {
    emergencies: new Array<Emergency>,
    selected: null
}

const store = new BehaviorSubject<Model>(initialState)

export default store
