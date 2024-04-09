import React from 'react';

import './App.css';

import {Route, Routes} from "react-router-dom";
import LoginView from './components/LoginView/LoginView';
import ProtectedRoute from './screens/ProtectedRoute';
import DataScreen from "./screens/DataScreen";

function App() {
  return (
    <Routes>
      <Route path='/' element={ProtectedRoute(<DataScreen/>)}></Route>
      <Route path='/login' element={<LoginView/>}></Route>
    </Routes>
  );
}

export default App;
