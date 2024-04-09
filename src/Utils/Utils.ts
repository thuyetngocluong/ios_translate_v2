import * as XLSX from "xlsx";
import axios from "axios";
import AuthService from "../services/AuthService";
import LanguageService from "../services/LanguageService";
import { KeyModel } from "../models/Key";
import KeyService from "../services/KeyService";
import JSZip from "jszip";


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
  async exportToZip() {
    try {
      const response = await KeyService.shared.fetch()
      if (response && response.length !== 0) {
        this._exportToZip(response)
      }
    } catch {

    }
  }

  private _exportToZip(keyModels: KeyModel[]) {
    const zip = new JSZip()
    const languages = AuthService.shared.currentUser?.prefered_languages || []
    languages.forEach(language => {
      var data: string[] = []
      keyModels
      .reverse()
      .forEach(keyModel => {
        let key = keyModel.key
        let translated = keyModel.translates.find(e => e.language.language_code === language.language_code)?.value || ""
        data.push(`"${key}"=${JSON.stringify(translated)};`)
      })
      
      if (language.language_code === "nb" || language.language_code === "no") {
        let folder = zip.folder(`nb-NO.lproj`)
        folder?.file("Localizable.strings", data.join("\n"))

        folder = zip.folder(`nb`)
        folder?.file("Localizable.strings", data.join("\n"))

        folder = zip.folder(`no`)
        folder?.file("Localizable.strings", data.join("\n"))
      } else 
      if (language.language_code === "pt") {
        let folder = zip.folder(`pt-PT.lproj`)
        folder?.file("Localizable.strings", data.join("\n"))
      } else {
        let folder = zip.folder(`${language.language_code}.lproj`)
        folder?.file("Localizable.strings", data.join("\n"))
      }
    })

    zip.generateAsync({ type: 'blob' }).then(blob => {
      // Create a temporary link to trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'result.zip';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    });
  }
  
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