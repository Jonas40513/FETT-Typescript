import { Department } from "./department"

export function getFormattedDate(start: Date, end?: Date) {
    let result = new Date(start).toLocaleString()
    if (end)
        result += ` - ${new Date(end).toLocaleString()}`
    return result
}

export function getLocation(district: string, location?: string, town?: string) {
    let result = ""
    if (location) {
        result += `${location}, `
        if (town && location !== town)
            result += `${town}, `
    }
    return result + district
}

export function getDepartments(departments: Department[]) {
    return departments.map(department => department.name).join(", ")
}

export function getIcon(type: string) {
    switch (type) {
        case "BRAND":
            return "../../images/type-fire.svg"
        case "TEE":
            return "../../images/type-tee.svg"
        case "PERSON":
            return "../../images/type-person.svg"
        case "UNWETTER":
            return "../../images/type-storm.svg"
        case "SONSTIGE":
            return "../../images/type-other.svg"
    }
}
