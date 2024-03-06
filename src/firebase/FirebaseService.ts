
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore, doc, collection, getDocs, getDoc, updateDoc, setDoc } from "firebase/firestore";
import {LanguageTranslate, LanguageTranslateItem} from "../models/LanguageItem";

export class FirebaseService {

  firestore: Firestore = undefined as any as Firestore

  static  shared = new FirebaseService()

  constructor() {
    let config = localStorage.getItem("ios_translate_v2_json")
    if (config && config.length !== 0) {
      const app = initializeApp(JSON.parse(config))
      this.firestore = getFirestore(app)
    }
  }

  config(firebaseConfig: any) {

    const app = initializeApp(firebaseConfig)
    this.firestore = getFirestore(app)
  }

  async getLanguage() : Promise<LanguageTranslate[]> {
    try {
      const ref = collection(this.firestore, 'remote_ios_language')
      let docSnapshots = await getDocs(ref)
      return docSnapshots.docs.map(doc => {
        let data = doc.data() as any
        return {
          languageCode: doc.id,
          languageName: data["LANGUAGE_NAME"],
          translate: []
          }
      })
    } catch(e: any) {
      return  []
    }
  }

  async getLocalization(): Promise<LanguageTranslate[]> {
    try {
      console.log("START GET")
      const ref = collection(this.firestore, 'remote_ios_localization')
      const docRef = doc(this.firestore, "remote_ios_localization", "en")

      let docSnapshots = await getDoc(docRef)
      console.log(docSnapshots.data())
      return  []
      // return docSnapshots.docs.map(doc => {
      //   let data = doc.data() as any
      //   let translate = data["translate"]
      //   return {
      //     languageCode: doc.id,
      //     languageName: data["LANGUAGE_NAME"],
      //     translate: translate.map((item: { key: string; value: string; }) => {
      //       return {
      //         key: item.key,
      //         value: item.value
      //       }
      //     })
      //   }
      // })
    } catch(e: any) {
      console.error("ERROR", e)
      return []
    }
  }

  async setLocalizations(localizations: LanguageTranslate[]) {
    try {
      for (let i = 0; i < localizations.length; i++) {
        let localization = localizations[i]
        const docRef = doc(this.firestore, "remote_ios_localization", localization.languageCode)
        const languageRef = doc(this.firestore, "remote_ios_language", localization.languageCode)

        let translate: LanguageTranslateItem[] = []
        localization.translate.forEach(item => {
          translate.push({
            key: item.key,
            value: item.value
          })
        })

        await setDoc(docRef, {
          "LANGUAGE_NAME": localization.languageName,
          "translate": translate
        })

        await setDoc(languageRef, {
          "LANGUAGE_NAME": localization.languageName
        })

        console.log("SET SUCCESS")
      }
    } catch(e: any) {
      console.log(e)
    }
  }
}