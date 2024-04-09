import {Application} from "../models/Application";
import axios from "axios";
import Const from "../Utils/Const";


export class ApplicationService {
    static shared = new ApplicationService()

    async fetchApplication(id: string): Promise<(Application | null)> {
      const response = await axios.get(
        Const.serverURL(`/api/application`),
        {
          params: {
            id: id
          },
          headers: Const.headers()
        }
      )
      return response.data
    }
}