import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassDetails from './pages/ClassDetails'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/class/:id" element={<ClassDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
