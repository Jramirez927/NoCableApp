import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register/Register'
import { JSX } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import StoryMap from './pages/storymap'
import MapProvider from './contexts/MapProvider'

function App(): JSX.Element {

  return (
      <Routes>
        <Route index  element={<Home />} />
        <Route path="register" element={<RegisterPage/>} />
        <Route path="login" element={<LoginPage/>} />
        <Route path="webapp" element={<ProtectedRoute children={<MapProvider><StoryMap/></MapProvider>}/>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  )
}

export default App
