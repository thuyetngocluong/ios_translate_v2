import {Language} from "./Language";

export interface Application {
    id: string,
    name: string,
    languages: Language[],
    default_context: string
}