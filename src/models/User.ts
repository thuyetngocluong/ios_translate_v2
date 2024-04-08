import { Application } from "./Application";
import { Language } from "./Language";

export interface User {
    id: string,
    username: string,
    email: string,
    applications: Application[],
    prefered_languages: Language[]
}
