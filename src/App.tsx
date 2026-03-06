import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CategoryPage from './pages/CategoryPage';
import AdminUsers from './pages/AdminUsers';

import About from './pages/About';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState<any>(null);

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar user={user} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
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
