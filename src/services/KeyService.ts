import axios from "axios";
import {KeyModel} from "../models/Key";
import Const from "../Utils/Const";
import AuthService from "./AuthService";
import {chunk} from "lodash";

class KeyService {
    static shared = new KeyService();

    async fetch(): Promise<KeyModel[]> {
        try {
            const response = await axios.get(Const.serverURL("/api/translates-all"), {
                headers: Const.headers(),
                params: {applicationID: Const.currentApplicationID()},
            });

            if (response.status === 200) {
                return response.data;
            } else {
                return [];
            }
        } catch {
            return [];
        }
    }

    async createOrUpdate(keys: KeyModel[], processing: (str: string) => void): Promise<void> {
        const total = keys.length;
        let current = 0;
        const chunks = chunk(keys, 10)
        for (let i = 0; i < chunks.length; i++) {
            const keys = chunks[i];

            try {
                await Promise.all(keys.map(key => this._createOrUpdate(key)))
                current += keys.length
                processing(`${current}/${total}`)
            } catch {

            }
        }
    }

    private async _createOrUpdate(key: KeyModel): Promise<void> {
        if (!key.application || !key.application.id) {
            const application = AuthService.shared.currentUser?.applications.find(e => e.id.toString() === Const.currentApplicationID())
            if (application) {
                key.application = application
            } else {
                return;
            }
        }
        key.unique = `${key.application.id}_${key.key}`;

        const data: any = Object.assign({}, key);

        try {
            const response = await axios.post(
                Const.serverURL("/api/create-or-update-key"),
                {
                    data: data,
                },
                {
                    headers: Const.headers(),
                }
            );
        } catch {
        }
    }

    async delete(key: string) {
        try {
            await axios.post(
                Const.serverURL("/api/delete-key"),
                {key: key},
                {headers: Const.headers()}
            );
        } catch {

        }
    }
}

export default KeyService;
