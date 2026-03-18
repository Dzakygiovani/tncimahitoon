import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  user: {
    role: string;
    email: string;
  };
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'border-b-2 border-white pb-1' : 'hover:text-blue-300 transition-colors';

  return (
    <nav className="bg-blue-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner">
            <img 
              src="https://i.pinimg.com/736x/2b/ef/45/2bef456557790102a2e11219520e2a99.jpg" 
              alt="Logo SMA TN" 
              className="w-full h-full object-contain mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-bold text-xl tracking-wider">SMA TN Cimahi</span>
        </Link>
        <div className="hidden md:flex space-x-6 items-center font-medium">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/comics" className={isActive('/comics')}>Comic</Link>
          <Link to="/novels" className={isActive('/novels')}>Novel</Link>
          {user.role === 'admin' && (
            <Link to="/admin/users" className={`flex items-center gap-1 ${isActive('/admin/users')}`}>
              <Shield size={16} />
              Admin
            </Link>
          )}
          <Link to="/about" className={isActive('/about')}>About Us</Link>
          <div className="flex items-center space-x-3 ml-4 border-l border-blue-700 pl-6">
            <Link to="/profile" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors shadow-sm">
              <User size={18} />
              <span>Profile</span>
            </Link>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500 text-red-200 hover:text-white p-2 rounded-full transition-colors"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
