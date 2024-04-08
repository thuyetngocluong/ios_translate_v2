import React, {ClipboardEventHandler, useEffect, useState} from 'react';

import './App.css';

import {createBrowserRouter, Route, Router, RouterProvider, Routes} from "react-router-dom";
import LoginView from './components/LoginView/LoginView';
import MainScreen from './screens/MainScreen';
import ProtectedRoute from './screens/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={ProtectedRoute(<MainScreen/>)}></Route>
      <Route path='/login' element={<LoginView/>}></Route>
      {/* <Route path='/excel/result' element={<DataExcelScreen/>}></Route> */}
    </Routes>
  );
}

export default App;
