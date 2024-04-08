import axios from "axios";
import { KeyModel } from "../models/Key";
import Const from "../Utils/Const";

class KeyService {
  static shared = new KeyService();

  async fetch(): Promise<KeyModel[]> {
    try {
      const resopnse = await axios.get(Const.serverURL("/api/translates-all"), {
        headers: Const.headers(),
        params: { applicationID: 2 },
      });
      console.log(resopnse.data);

      if (resopnse.status == 200) {
        return resopnse.data;
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
        continue;
      }
      key.unique = `${key.application.id}_${key.key}`;

      var data: any = Object.assign({}, key);
      delete data.id;

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
