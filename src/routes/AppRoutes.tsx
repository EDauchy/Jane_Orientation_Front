import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import About from "../pages/About";
import Blog from "../pages/Blog";
import BlogArticle from "../pages/BlogArticle";
import Contact from "../pages/Contact";
import Dashboard from "../pages/Dashboard";
import FAQPage from "../pages/FAQPage";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OrientationTest from "../pages/OrientationTest";
import Register from "../pages/Register";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyDashboard from "../pages/dashboard/Dashboard";
import DashboardSecuritySettings from "../pages/dashboard/DashboardSecuritySettings";
import DashboardAccountSettings from "../pages/dashboard/DashboardAccountSettings";
import DashboardMaps from "../pages/dashboard/DashboardMaps";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export function AppRoutes(): React.JSX.Element {
  const location = useLocation();
  const background =
    location.state &&
    (location.state as { backgroundLocation?: Location }).backgroundLocation;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogArticle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <OrientationTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

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
