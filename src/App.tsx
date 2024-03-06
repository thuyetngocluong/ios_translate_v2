import React, {ClipboardEventHandler, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Utils} from "./Utils/Utils";
import ExcelResult from "./models/ExcelResult";
import ResultView from "./components/Result/ResultView";
import {FirebaseService} from "./firebase/FirebaseService";
import DragDrop from "./components/DragDrop";
import ImportDataFromExcel from "./components/ImportDataFromExcel";
import LocalizationDetail from "./components/LocalizationDetail/LocalizationDetail";
import {Provider, useDispatch, useSelector} from "react-redux";
import store, {RootState} from "./redux/store";
import {LanguageTranslate} from "./models/LanguageItem";



function App() {

  const dispatch = useDispatch()
  const localizations = useSelector((state: RootState) => state.languageTranslate);

  useEffect(() => {
    window.addEventListener("paste", (e) => {
      let cast = e as unknown  as React.ClipboardEvent<Window>
      if (cast) {
        handlePaste(cast)
      }
    });

    return () => {
      window.removeEventListener("paste", () => {});
    };
  }, []);
  const handlePaste = (event: React.ClipboardEvent<Window>) => {
    FirebaseService.shared.config(event)
  };

  return (
      <div className="App">
        { localizations.length === 0 ? <DragDrop/> : ""}
        { localizations.length === 0 ? <ImportDataFromExcel/> : ""}

        <LocalizationDetail/>
      </div>
  );
}

export default App;
