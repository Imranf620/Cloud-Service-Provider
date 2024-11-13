import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import NotFound from "./pages/NotFound/NotFound"
import SignUp from "./pages/SignUp/SignUp"
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path='/' element={  <Layout/>} >
      <Route element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="files" element={<Dashboard />} />

      </Route>
      <Route path="*" element={<NotFound />} />
   

    
    </Routes>
  )
}

export default App