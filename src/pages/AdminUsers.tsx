import { useState, useEffect } from 'react';
import { Trash2, User, Clock, Shield } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  role: string;
  created_at: string;
  last_login: string | null;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<{id: number, email: string} | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Gagal mengambil data user');
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError('Terjadi kesalahan koneksi: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number, email: string) => {
    console.log("Tombol delete diklik untuk user:", id, email);
    setDeleteTarget({ id, email });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    const { id, email } = deleteTarget;
    console.log("Memulai proses penghapusan untuk:", id, email);
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      console.log("Response status:", res.status);
      
      const data = await res.json();
      console.log("Response data:", data);
      
      if (data.success) {
        setUsers(users.filter(user => user.id !== id));
        // alert(data.message || 'User berhasil dihapus. User harus mendaftar ulang untuk login kembali.');
      } else {
        alert(data.message || 'Gagal menghapus user');
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      alert('Terjadi kesalahan saat menghapus user: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Shield className="text-blue-600" size={32} />
          Manajemen User
        </h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
          Total User: {users.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Email Sekolah</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Bergabung</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Terakhir Login</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      {formatDate(user.last_login)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(user.id, user.email);
                        }}
                        className="relative z-10 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Hapus User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Belum ada user yang terdaftar.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus user <span className="font-semibold text-gray-800">{deleteTarget.email}</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium shadow-sm"
              >
                Hapus User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
