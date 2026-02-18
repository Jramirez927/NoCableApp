import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
      <Routes>
        <Route index  element={<Home />} />
        <Route path="register" element={<h1>Register</h1>} />
        <Route path="login" element={<h1>Login</h1>} />
        <Route path="webapp" element={<h1>WebApp</h1>} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  )
}

export default App
