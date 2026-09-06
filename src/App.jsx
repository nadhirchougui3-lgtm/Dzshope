import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Navbar from './navbar'
import LandingPage from './LandingPage'
import Footer from './footer'

function App() { 
  

  return (
    <>
    <Navbar />
    <LandingPage />
    <Footer />
    </>
  )
}

export default App
