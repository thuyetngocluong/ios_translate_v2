import { RawAxiosRequestHeaders, AxiosHeaders } from "axios";


const ALL_LANGUAGE_CODES = []
const SERVER_HOST = "http://localhost:1337"

export default {
    serverURL(path: string) : string {
        return SERVER_HOST + path
    },

    headers: () => {
        return {
            Authorization: "Bearer " + localStorage.getItem("token")
        } as (RawAxiosRequestHeaders) | AxiosHeaders;
    }
}