import Home from './pages/home';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/Login';
import RegisterPage from './pages/register/Register';
import { JSX } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import StoryMap from './pages/storymap/Storymap';
import MapProvider from './contexts/MapProvider';
import AppNavbar from './components/AppNavbar/AppNavbar';

function App(): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <AppNavbar />
      <div style={{ display: 'flex', height: '100%', overflowY: 'auto' }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="webapp"
            element={
              <ProtectedRoute
                children={
                  <MapProvider>
                    <StoryMap />
                  </MapProvider>
                }
              />
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
