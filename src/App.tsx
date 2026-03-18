import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';
import AdminUsers from './pages/AdminUsers';

import About from './pages/About';
import Profile from './pages/Profile';

const INACTIVITY_LIMIT = 3 * 60 * 1000; // 3 minutes in milliseconds

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem('livo_user');
    const lastActive = localStorage.getItem('livo_last_active');
    
    if (storedUser && lastActive) {
      const timePassed = Date.now() - parseInt(lastActive, 10);
      if (timePassed < INACTIVITY_LIMIT) {
        return JSON.parse(storedUser);
      } else {
        localStorage.removeItem('livo_user');
        localStorage.removeItem('livo_last_active');
      }
    }
    return null;
  });

  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      localStorage.setItem('livo_last_active', Date.now().toString());
    };

    // Initial update on mount
    updateActivity();

    let throttleTimer: any;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 1000); // Throttle updates to max once per second
    };

    // Listen for user interactions
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Check for inactivity periodically
    const intervalId = setInterval(() => {
      const lastActive = localStorage.getItem('livo_last_active');
      if (lastActive) {
        const timePassed = Date.now() - parseInt(lastActive, 10);
        if (timePassed >= INACTIVITY_LIMIT) {
          // Session expired
          setUser(null);
          localStorage.removeItem('livo_user');
          localStorage.removeItem('livo_last_active');
          alert("Sesi Anda telah berakhir karena tidak ada aktivitas selama 3 menit. Silakan login kembali.");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      clearInterval(intervalId);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [user]);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('livo_user', JSON.stringify(userData));
    localStorage.setItem('livo_last_active', Date.now().toString());
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('livo_user');
    localStorage.removeItem('livo_last_active');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
            <Route path="/comics" element={<CategoryPage type="comic" title="Koleksi Komik" user={user} />} />
            <Route path="/novels" element={<CategoryPage type="novel" title="Koleksi Novel" user={user} />} />
            <Route path="/browse" element={<CategoryPage title="Jelajahi Genre" user={user} />} />
            <Route 
              path="/admin/users" 
              element={user.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
