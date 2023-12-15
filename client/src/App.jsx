import React from 'react'
import {BrowserRouter,Routes,Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
const App = () => {
  return (
    <BrowserRouter >
      <Header/>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/sign-in' element={<Signin/>}/>
         <Route path='/signup' element={<Signup/>}/>
         <Route path='/about' element={<About/>}/>
         {/* <Route element={PrivateRoute}> */}
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/create-listing' element={<CreateListing/>}/>
         {/* </Route> */}
         {/* <PrivateRoute path='/profile' element={<Profile />} /> */}
         {/* <Route path='*' element={<Navigate to='/' />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App