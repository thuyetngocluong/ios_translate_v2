import { RawAxiosRequestHeaders, AxiosHeaders } from "axios";


export default {
    serverURL(path: string) : string {
        return process.env.REACT_APP_SERVER_URL + path
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