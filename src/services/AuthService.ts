import axios from "axios";
import Const from "../Utils/Const";
import { User } from "../models/User";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/user.redux";
import { Language } from "../models/Language";

class AuthService {
    
    static shared = new AuthService()
    
    // dispatch = useDispatch()

    currentUser: (User | null) = null

    async checkAuthenticate(): Promise<boolean> {
        try {
            let response = await axios.get(
                Const.serverURL("/api/me"),
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                }
            )
            let me = response.data
            if (me) {
                this.currentUser = me
                // this.dispatch(updateUser(me))
                return true
            } else {
                this.currentUser = null
                // this.dispatch(updateUser(null))
                return false
            }
        } catch(e: any) {
            this.currentUser = null
            // this.dispatch(updateUser(null))
            return false
        }
    }

    async login(username: string, password: string): Promise<boolean> {
        const response = await axios.post(
            Const.serverURL("/api/auth/local"),
            {
                identifier: username,
                password: password
            }
        )
        if (response.data.jwt) {
            localStorage.setItem("token", response.data.jwt)
            console.log(response.data.jwt)
            return await this.checkAuthenticate()
        }
        return false
    }

    async logout() {
        this.currentUser = null
        // this.dispatch(updateUser(null))
        localStorage.removeItem("token")
    }

    async updatePreferredLanguages(languages: Language[]): Promise<void> {
        const response = await axios.put(
            Const.serverURL("/api/me"),
            {
                prefered_languages: languages
            },
            {
                headers: Const.headers()
            }
        )
        await this.checkAuthenticate()
    }
}


export default AuthService;