import { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'; 
import './App.css'
import Login from './pages/Auth/Login';
import Home from './pages/Home/Home';
import SignUp from './pages/Auth/SignUp';

const App = () => {
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
  </BrowserRouter>)
}

export default App
