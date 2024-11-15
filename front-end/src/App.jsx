import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login/Login"
import NotFound from "./pages/NotFound/NotFound"
import SignUp from "./pages/SignUp/SignUp"
import Layout from './layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Storage from './pages/Storage/Storage'
import Packages from './pages/Packages/Packages'


const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path='/' element={  <Layout/>} >
      <Route path="" element={<Dashboard />} />
      <Route path="dashboard/:type" element={<Storage />} />
      <Route path="packages" element={<Packages />} />

      </Route>
      <Route path="*" element={<NotFound />} />
   

    
    </Routes>
  )
}

export default App