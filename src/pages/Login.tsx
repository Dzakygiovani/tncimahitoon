import React, { useState } from 'react';
import { Shield, User, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Frontend validation for user
    if (!isAdmin && !email.endsWith('@cimahi.tarunanusantara.sch.id')) {
      setError('Format akun sekolah harus NIS@cimahi.tarunanusantara.sch.id');
      setLoading(false);
      return;
    }

    if (isRegistering && password.length < 8) {
      setError('Password minimal 8 karakter');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegistering ? '/api/register' : '/api/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isAdmin }),
      });

      const data = await response.json();

      if (data.success) {
        if (isRegistering) {
          setSuccess(data.message);
          setIsRegistering(false);
          setPassword('');
        } else {
          onLogin(data.user);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/school/800/400')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center overflow-hidden shadow-lg relative z-10">
            <img 
              src="https://i.pinimg.com/736x/2b/ef/45/2bef456557790102a2e11219520e2a99.jpg" 
              alt="Logo SMA TN" 
              className="w-full h-full object-contain mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-bold text-white relative z-10">Webtoon SMA TN</h1>
          <p className="text-blue-100 text-sm mt-2 relative z-10 font-medium">Platform Webtoon Siswa SMA TN Cimahi</p>
        </div>
        
        <div className="p-8">
          {!isRegistering && (
            <div className="flex bg-slate-100 rounded-xl p-1 mb-8 shadow-inner">
              <button 
                type="button"
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${!isAdmin ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => { setIsAdmin(false); setError(''); }}
              >
                Siswa / User
              </button>
              <button 
                type="button"
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${isAdmin ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => { setIsAdmin(true); setError(''); }}
              >
                Admin LIVO
              </button>
            </div>
          )}

          {isRegistering && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">Buat Password Baru</h2>
              <p className="text-sm text-slate-500 mt-1">Gunakan akun sekolah Anda untuk mendaftar.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start rounded-r-lg">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm flex items-start rounded-r-lg">
              <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {isAdmin ? 'Admin ID' : 'Akun Sekolah'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {isAdmin ? <Shield className="h-5 w-5 text-slate-400" /> : <User className="h-5 w-5 text-slate-400" />}
                </div>
                <input 
                  type="text" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow bg-slate-50 focus:bg-white"
                  placeholder={isAdmin ? "Masukkan ID Admin" : "NIS@cimahi.tarunanusantara.sch.id"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow bg-slate-50 focus:bg-white"
                  placeholder={isRegistering ? "Buat password baru" : "Masukkan password"}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>{isRegistering ? 'Daftar Sekarang' : 'Masuk'} <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            {isRegistering ? (
              <p>
                Sudah punya password? <br/>
                <button 
                  onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}
                  className="text-blue-600 font-bold hover:underline mt-1 inline-block"
                >
                  Kembali ke Login
                </button>
              </p>
            ) : !isAdmin && (
              <p>
                Belum punya password? <br/>
                <button 
                  onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); }}
                  className="text-blue-600 font-bold hover:underline mt-1 inline-block"
                >
                  Buat password baru
                </button> menggunakan akun sekolah.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
