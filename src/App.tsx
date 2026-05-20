import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OrientationTest from './pages/OrientationTest';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import DashboardHome from './pages/dashboard/DashboardHome';
import Contact from './pages/Contact';
import FAQPage from './pages/FAQPage';
import MyDashboard from './pages/dashboard/Dashboard';
import DashboardSecuritySettings from './pages/dashboard/DashboardSecuritySettings';
import DashboardAccountSettings from './pages/dashboard/DashboardAccountSettings';
import DashboardMaps from './pages/dashboard/DashboardMaps';
import About from './pages/About';

import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function AppRoutes() {
  const location = useLocation();

  // On récupère l'état 'backgroundLocation' si on a navigué via un state
  const background = location.state?.backgroundLocation || 
    (location.pathname.startsWith('/mydashboard') ? { pathname: "/" } : null);

  return (
    <>
      {/* Routes de base :
          Si background existe, on force ces routes à afficher la page précédente
      */}
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/faq' element={<FAQPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogArticle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={
          <ProtectedRoute>
            <OrientationTest />
          </ProtectedRoute>
        } />

        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>

      {/* Route Modale :
          Elle ne s'affiche qu'en superposition si background est défini
      */}
      {background && (
        <Routes>
          <Route
            path="/mydashboard/*"
            element={
              <ProtectedRoute>
                <MyDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="security" element={<DashboardSecuritySettings />} />
            <Route path="maps" element={<DashboardMaps />} />
            <Route path="account" element={<DashboardAccountSettings />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;