import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'

function App() {

  return (
      <Routes>
        <Route index  element={<Home />} />
        <Route path="register" element={<RegisterPage/>} />
        <Route path="login" element={<LoginPage/>} />
        <Route path="webapp" element={<h1>WebApp</h1>} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  )
}

export default App
