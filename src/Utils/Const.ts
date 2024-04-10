import { RawAxiosRequestHeaders, AxiosHeaders } from "axios";


const SERVER_HOST = "http://10.10.21.213:1337"

export default {
    serverURL(path: string) : string {
        return SERVER_HOST + path
    },

    headers: () => {
        return {
            Authorization: "Bearer " + localStorage.getItem("token")
        } as (RawAxiosRequestHeaders) | AxiosHeaders;
    },

    currentApplicationID: () => {
        return localStorage.getItem("applicationID")
    }
}