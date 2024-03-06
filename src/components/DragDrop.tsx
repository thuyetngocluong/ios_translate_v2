import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import {FirebaseService} from "../firebase/FirebaseService";
import {useDispatch} from "react-redux";
import {LanguageTranslate} from "../models/LanguageItem";
import {setLanguageTranslate} from "../redux/LanguageTranslateRedux";


const fileTypes = ["json"];

function DragDrop() {

  const dispatch = useDispatch()

  const handleChange = (file: any) => {

    let reader = new FileReader()
    reader.onload = (event) => {
      let jsonString = (event.target as any).result as string

      const firebaseConfig = JSON.parse(jsonString);

      FirebaseService.shared.config(firebaseConfig)
      FirebaseService.shared.getLanguage()
        .then( result => {
            dispatch(setLanguageTranslate(result))
            localStorage.setItem("ios_translate_v2_json", jsonString)
        })
      if (jsonString.length !== 0) {
      }


    }
    reader.readAsText(file)
  };




  return (
    <div className="App">
      <FileUploader handleChange={handleChange} name="file" multiply={false} types={fileTypes}/>
    </div>
  );
}

export default DragDrop;