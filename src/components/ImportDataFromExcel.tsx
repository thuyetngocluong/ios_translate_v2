import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import {FirebaseService} from "../firebase/FirebaseService";
import {LanguageTranslate, LanguageTranslateItem} from "../models/LanguageItem";
import {useDispatch} from "react-redux";
import {setLanguageTranslate} from "../redux/LanguageTranslateRedux";
import {Utils} from "../Utils/Utils";


const fileTypes = ["xlsx"];

function ImportDataFromExcel() {

  const dispatch = useDispatch()
  const handleChange = (file: any) => {

    let reader = new FileReader()
    reader.onload = (event) => {
      let sheet = XLSX.read((event.target as any).result).Sheets.Sheet1
      const range = XLSX.utils.decode_range(sheet["!ref"] as string);

      const columnLetters = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        const cell = sheet[cellAddress];
        if (cell && cell.v) {
          columnLetters.push(XLSX.utils.encode_col(col));
        }
      }

      const columnData: any = {};
      columnLetters.forEach(columnLetter => {
        const columnDataArray = [];
        for (let row = range.s.r; row <= range.e.r; row++) {
          const cellAddress = columnLetter + (row + 1);
          const cell = sheet[cellAddress];
          if (cell) {
            columnDataArray.push(cell.v);
          } else {
            columnDataArray.push(null);
          }
        }
        columnData[columnLetter] = columnDataArray;
      });

      let keyDataArray = columnData["A"]

      let translated: (LanguageTranslate | null)[] = columnLetters
        .map(columnLetter => {
          if (columnLetter !== 'A') {
            let columnArray = columnData[columnLetter]
            let languageName = columnArray[0]
            let languageCode = columnArray[1]

            let translated: LanguageTranslateItem[] = []
            for (let i = 3; i < columnArray.length; i++) {
              let key = keyDataArray[i]
              let value = columnArray[i]
              if (key && key.length !== 0) {
                translated.push({
                  key: key,
                  value: Utils.shared.remakeValue(value)
                })
              }
            }

            return {
              languageCode: languageCode,
              languageName: languageName,
              translate: translated
            } as LanguageTranslate
          } else {
            return null
          }
        })
        .filter(e => e)

      console.log(translated)
      dispatch(setLanguageTranslate(translated))

      FirebaseService.shared.setLocalizations(translated as LanguageTranslate[])
        .then(e => {
          console.log("OK")
        })
    }
    reader.readAsArrayBuffer(file)
  };




  return (
    <div className="App">
      <FileUploader handleChange={handleChange} name="file" multiply={false} types={fileTypes}/>
    </div>
  );
}

export default ImportDataFromExcel;