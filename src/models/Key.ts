import { Application } from "./Application"
import { Language } from "./Language"


export interface TranslateItem {
    language: Language
    value: string
}

export interface KeyModel {
    id: string
    key: string
    unique: string | null
    application: Application
    translates: TranslateItem[]
}