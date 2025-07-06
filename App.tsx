import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import NewsletterPage from './pages/NewsletterPage';
import JobPortalPage from './pages/JobPortalPage';
import CertificationPage from './pages/CertificationPage';
import CareerGuidePage from './pages/CareerGuidePage';
import ForumPage from './pages/ForumPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import MatchmakingPage from './pages/MatchmakingPage';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
    const { theme } = useTheme();

    React.useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/newsletter" element={<NewsletterPage />} />
                <Route path="/jobs" element={<JobPortalPage />} />
                <Route path="/certifications" element={<CertificationPage />} />
                <Route path="/career-guide" element={<ProtectedRoute><CareerGuidePage /></ProtectedRoute>} />
                <Route path="/forum" element={<ForumPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/matchmaking" element={<ProtectedRoute><MatchmakingPage /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </main>
        <Footer />
      </div>
    );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;