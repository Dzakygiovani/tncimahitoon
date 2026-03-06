import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Key, Clock } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  role: string;
  password?: string;
  created_at: string;
  last_login: string;
}

export default function Profile() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal mengambil data user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Data Akun Pengguna</h1>
          <p className="text-slate-500">
            Daftar semua akun terdaftar (Admin & Siswa) beserta informasi login.
          </p>
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-100">
            <strong>Catatan:</strong> Password ditampilkan dalam bentuk terenkripsi (hash) untuk keamanan. 
            Jika lupa password, silakan hubungi admin untuk reset atau buat akun baru.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-semibold text-slate-700 w-16">ID</th>
                  <th className="p-4 font-semibold text-slate-700">Email / Username</th>
                  <th className="p-4 font-semibold text-slate-700">Role</th>
                  <th className="p-4 font-semibold text-slate-700">Password (Hash)</th>
                  <th className="p-4 font-semibold text-slate-700">Terdaftar</th>
                  <th className="p-4 font-semibold text-slate-700">Login Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500 font-mono text-sm">#{user.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-slate-900">
                        <User className="w-4 h-4 text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'admin' ? 'Administrator' : 'Siswa'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 max-w-[200px] truncate" title={user.password}>
                        <Key className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{user.password || 'No Password'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {user.last_login ? new Date(user.last_login).toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
