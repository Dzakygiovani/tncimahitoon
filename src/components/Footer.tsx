import { BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-10 mt-12 border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <div className="flex space-x-6 mb-8 text-sm font-medium text-blue-200">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/comics" className="hover:text-white transition-colors">Comic</Link>
          <Link to="/novels" className="hover:text-white transition-colors">Novel</Link>
          <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
          <span className="text-blue-200/50 cursor-not-allowed">Contact</span>
        </div>
        
        <div className="text-center text-blue-400 text-sm mb-6">
          &copy; 2025 LIVO SMA TN Cimahi
        </div>
        
        <div className="flex flex-col items-center justify-center text-blue-300/60">
          <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mb-3 shadow-inner">
            <BookMarked size={28} className="text-blue-300" />
          </div>
          <span className="text-xs tracking-widest uppercase font-semibold">Logo Livo</span>
        </div>
      </div>
    </footer>
  );
}
