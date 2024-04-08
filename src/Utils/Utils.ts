import * as XLSX from "xlsx";
import axios from "axios";
import AuthService from "../services/AuthService";
import LanguageService from "../services/LanguageService";
import { KeyModel } from "../models/Key";
import KeyService from "../services/KeyService";


export class Utils {
  static shared = new Utils()

  remakeValue(value: string): string {

    let make = value.replace(/% @/g, "%@")
      .replace(/％@/g, "%@")
      .replace(/％ @g/, "%@")
      .replace(/٪@/g, "%@")
      .replace(/٪ @/g, "%@")
      .replace(/\\ n/ig, "\n")
      .replace(/\\n/ig, "\n")

    return  make
  }

  random(): number {
    var min = Math.ceil(1);
    var max = Math.floor(10000);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // async syncToServer(languageTranslates: LanguageTranslate[]) {

  //   var english = languageTranslates.find(e => e.languageCode == 'en')

  //   for (let i = 0; i < languageTranslates.length; i++) {
  //     var languageTranslate = languageTranslates[i]
  //     var languageCode = languageTranslate.languageCode
      
  //     for(let j = 0; j < languageTranslate.translate.length; j++) {
  //       var item = languageTranslate.translate[j]
  //       var key = item.key
  //       var translated = item.value
  //       let source = english?.translate.find(e => e.key === key)?.value || ""
  //       try {
  //         await TranslateService.shared.createOrUpdate({
  //           key: key,
  //           source: source,
  //           translated: translated,
  //           unique: "",
  //           application: AuthService.shared.currentUser?.applications[0] as any,
  //           language: LanguageService.shared.languages.find(e => e.language_code === languageCode) as any
  //         })
  //       } catch {

  //       }
  //     }
  //   }
  // }

  async exportToStringCatalog() {
    try {
      const response = await KeyService.shared.fetch()
      if (response && response.length !== 0) {
        this._exportToStringCatalog(response)
      }
    } catch {

    }
  }

  private _exportToStringCatalog(keyModels: KeyModel[]) {
    let result = {
      "sourceLanguage": "en",
      "strings": {} as any,
      "version": "1.0"
    }
    
    keyModels.forEach(key => {
        result.strings[key.key] = {
          "extractionState" : "manual",
          "localizations": {}
        }
        let rs = {} as any
        key.translates.forEach(tranlsate => {
          let data = {
            "stringUnit" : {
              "state" : "translated",
              "value" : tranlsate.value
            }
          }
          rs[tranlsate.language.language_code] = data

          if (tranlsate.language.language_code === "nb" || tranlsate.language.language_code === "no") {
            rs["nb-NO"] = data
            rs["nb"] = data
            rs["no"] = data
          }
          if (tranlsate.language.language_code === "pt") {
            rs["pt-PT"] = data
          }
        })

        result.strings[key.key]["localizations"] = rs

    })

    this.triggerDownload(result)
  }

  triggerDownload(results: any) {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' })

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and simulate a click on it
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Localizable.xcstrings';
    document.body.appendChild(link);
    link.click();

    // Clean up the URL and link
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

 chunkArray<T>(array: T[], size: number): T[][] {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
}