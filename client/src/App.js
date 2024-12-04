import './index.css';
import React, { useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import ProtectedRoutes from './utils/ProtectedRoutes'
import Navbar from "./components/Navbar";

// import pages
import Login from './screens/login';
import Home from './screens/home';
import Menu from './screens/menu';



function App(children) {

  const [backendData, setBackendData] = useState([{}])
  const [validated, setValidated] = useState(false);

  return (
      
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route element={<Login/>} path="/login"/>
            <Route element={<ProtectedRoutes/>}>
              <Route element={<Home/>} path="/"/>
              <Route element={<Menu/>} path="/menu"/>
            </Route>
            
          
          </Routes>
        </BrowserRouter>
      
  )
}

export default App
