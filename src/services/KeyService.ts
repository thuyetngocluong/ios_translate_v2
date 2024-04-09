import axios from "axios";
import { KeyModel } from "../models/Key";
import Const from "../Utils/Const";
import AuthService from "./AuthService";

class KeyService {
  static shared = new KeyService();

  async fetch(): Promise<KeyModel[]> {
    try {
      const response = await axios.get(Const.serverURL("/api/translates-all"), {
        headers: Const.headers(),
        params: { applicationID: 1 },
      });
      console.log("RESPONSE", response);

      if (response.status === 200) {
        return response.data;
      } else {
        return [];
      }
    } catch {
      return [];
    }
  }

  async createOrUpdate(keys: KeyModel[]): Promise<void> {
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!key.application || !key.application.id) {
        const application = AuthService.shared.currentUser?.applications[0]
        if (application) {
          key.application = application
        } else {
          continue
        }
      }
      key.unique = `${key.application.id}_${key.key}`;

      var data: any = Object.assign({}, key);
      
      try {
        const resopnse = await axios.post(
          Const.serverURL("/api/create-or-update-key"),
          {
            data: data,
          },
          {
            headers: Const.headers(),
          }
        );
        console.log(resopnse.data);
      } catch {}
    }
  }

  async delete(key: string) {
    try {
      await axios.post(
      Const.serverURL("/api/delete-key"),
        { key: key },
        { headers: Const.headers() }
      );
    } catch {

    }
  }
}

export default KeyService;
