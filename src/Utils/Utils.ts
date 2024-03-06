import * as XLSX from "xlsx";
import axios from "axios";
import ExcelResult from "../models/ExcelResult";
import {LanguageTranslate} from "../models/LanguageItem";
export class Utils {
  static shared = new Utils()

  remakeValue(value: string): string {
    return value.replace(/% @/g, "%@")
      .replace(/％@/g, "%@")
      .replace(/％ @g/, "%@")
      .replace(/٪@/g, "%@")
      .replace(/٪ @/g, "%@")
      .replace(/\/ n/g, "/n")
  }
  exportToStringCatalog(localizations: LanguageTranslate[]) {
    let result = {
      "sourceLanguage": "en",
      "strings": {} as any,
      "version": "1.0"
    }
    let mapping = {} as any
    localizations.forEach(localization => {
      let result = {} as any
      localization.translate.forEach(item => {
        result[item.key] = item.value
      })
      mapping[localization.languageCode] = result
    })
    let keys = localizations[0].translate.map(e => e.key)
    let languageCodes = localizations.map(e => e.languageCode)

    console.log("LanguageCode", mapping)

    keys.forEach(key => {
        result.strings[key] = {
          "extractionState" : "manual",
          "localizations": {}
        }
        let rs = {} as any
        languageCodes.forEach(languageCode => {
          let data = {
            "stringUnit" : {
              "state" : "translated",
              "value" : (mapping[languageCode] || {} as any)[key] || ""
            }
          }
          rs[languageCode] = data

          if (languageCode === "nb" || languageCode === "no") {
            rs["nb-NO"] = data
            rs["nb"] = data
            rs["no"] = data
            console.log(rs)
          }
          if (languageCode === "pt") {
            rs["pt-PT"] = data
          }
        })

        result.strings[key]["localizations"] = rs

    })

    console.log(result)
    this.triggerDownload(result)
  }

  triggerDownload(results: any) {
    const data = JSON.stringify(results);
    const blob = new Blob([data], { type: 'text/plain' });

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
}