import axios from "axios";
import { Language } from "../models/Language";
import Const from "../Utils/Const";
import { Utils } from "../Utils/Utils";


function areSetsEqual<T>(set1: Set<T>, set2: Set<T>): boolean {
    if (set1.size !== set2.size) {
        return false;
    }
    
    for (const item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }
    return true;
}

class LanguageService {
  static shared = new LanguageService();

  languages: Language[] = [];

  async fetchLanguages(): Promise<Language[]> {
    let page = 1;
    let languages: Language[] = [];
    while (true) {
      let response = await this._fetchLanguages(page);
      if (response.length === 0) {
        break;
      }
      languages = languages.concat(response);
      page += 1;
    }
    this.languages = languages;
    return languages;
  }

  private async _fetchLanguages(page: number): Promise<Language[]> {
    try {
      let response = await axios.get(
        Const.serverURL(`/api/langages?sort=id&pagination[page]=${page}`),
        { headers: Const.headers() }
      );
      return response.data.data.map((e: any) => {
        return { ...{ id: e.id }, ...e.attributes } as Language;
      });
    } catch {
      return [];
    }
  }

  async translate(
    texts: string[],
    context: string,
    languageCodes: string[],
    process: (text: string) => void
  ): Promise<any> {
    const total = texts.length;
    let current = 0;

    const chunked = Utils.shared.chunkArray(texts, 10);
    const result: any = {};

    process(`Translating ${current}/${total}`);
    for (let i = 0; i < chunked.length; i++) {
      const chunk = chunked[i];
      try {
        let responses = await Promise.all(
          chunk.map((e) => this._translate(e, context, languageCodes))
        );

        current += chunk.length;
        process(`Translating ${current}/${total}`);
        
        languageCodes.forEach((languageCode) => {
          responses.forEach((response) => {
            let existValue = (result[languageCode] || []) as string[];
            let responseValue = Utils.shared.remakeValue(response[languageCode] || "")
            existValue.push(responseValue);
            result[languageCode] = existValue;
          });
        });
      } catch {
        languageCodes.forEach((languageCode) => {
          let existValue = (result[languageCode] || []) as string[];
          let responseValue = Utils.shared.remakeValue("")
          existValue.push(responseValue);
          result[languageCode] = existValue;
        });
      }
    }
    return result;
  }

  private async _translate(
    text: string,
    context: string,
    languageCodes: string[],
    tryCount: number = 1
  ): Promise<any> {
    if (tryCount < 0) {
      const rs: any = {};
      languageCodes.forEach(languageCode => {
        rs[languageCode] = ""
      })
      return rs
    }

    try {
      let response = (
        await axios.post(
          Const.serverURL("/api/translate-text"),
          {
            text: text,
            context: context,
            languageCodes: languageCodes,
          },
          {
            headers: Const.headers(),
          }
        )
      ).data;

      if (Object.values(response).includes((e: any) => {
        return Array.isArray(e) && (e.length === 0 || e.includes(""))
      })) {
        return this._translate(text, context, languageCodes, tryCount - 1);
      }

      if (!areSetsEqual(new Set(languageCodes), new Set(Object.keys(response)))) {
        return this._translate(text, context, languageCodes, tryCount - 1);
      }
      
      return response

    } catch {
      return this._translate(text, context, languageCodes, tryCount - 1);
    }
  }
}

export default LanguageService;
