import axios from "axios";
import Const from "../Utils/Const";
import {User} from "../models/User";
import {Language} from "../models/Language";
import {Application} from "../models/Application";

class AuthService {
    
    static shared = new AuthService()
    
    // dispatch = useDispatch()

    currentUser: (User | null) = null

    selectedApplication(): Application | null {
        return this.currentUser?.applications.find(e => e.id.toString() === Const.currentApplicationID()) || null
    }

    async checkAuthenticate(): Promise<(User | null)> {
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
            } else {
                this.currentUser = null
            }
        } catch(e: any) {
            this.currentUser = null
        }
        return this.currentUser
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
            return await this.checkAuthenticate() != null
        }
        return false
    }

    logout() {
        this.currentUser = null
        localStorage.removeItem("token")
        localStorage.removeItem("applicationID")
    }

    async updatePreferredLanguages(languages: Language[]): Promise<void> {
        const response = await axios.put(
            Const.serverURL("/api/application"),
            {
                languages: languages
            },
            {
                headers: Const.headers()
            }
        )
        await this.checkAuthenticate()
    }
}


export default AuthService;