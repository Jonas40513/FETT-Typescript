import { Department } from "./department";

export interface Emergency {
    readonly id: string,
    readonly start: Date,
    readonly end?: Date,
    readonly level: number,
    readonly type: string,
    readonly subtype: string,
    readonly location?: string,
    readonly town?: string,
    readonly district: string,
    readonly latitude: number,
    readonly longitude: number,
    readonly departments: Department[]
}