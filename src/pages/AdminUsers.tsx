import React, { useState } from 'react';
import { Shield, Search, Key, User, Copy, Check, Download, Loader2 } from 'lucide-react';
import { getStudentPassword } from '../authData';
import * as XLSX from 'xlsx';

export default function AdminUsers() {
  const [nis, setNis] = useState('');
  const [result, setResult] = useState<{email: string, password: string} | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const nisNum = parseInt(nis);
    if (nisNum >= 2410000 && nisNum <= 2599999) {
      const password = getStudentPassword(nisNum);
      setResult({
        email: `${nisNum}@cimahi.tarunanusantara.sch.id`,
        password
      });
    } else {
      alert("NIS harus di antara 2410000 - 2599999");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAllPasswords = () => {
    setIsDownloading(true);
    
    // Use setTimeout to allow UI to update (show loading)
    setTimeout(() => {
      try {
        const data = [];
        // NIS range: 2410000 to 2599999
        for (let i = 2410000; i <= 2599999; i++) {
          data.push({
            'NIS': i,
            'Email Sekolah': `${i}@cimahi.tarunanusantara.sch.id`,
            'Password': getStudentPassword(i)
          });
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Akun Siswa");
        
        // Generate file and trigger download
        XLSX.writeFile(workbook, "Data_Akun_Siswa_Tarnus.xlsx");
      } catch (error) {
        console.error("Error generating Excel:", error);
        alert("Terjadi kesalahan saat membuat file Excel. Silakan coba lagi.");
      } finally {
        setIsDownloading(false);
      }
    }, 100);
  };

  // Example list for the admin
  const examples = [2410880, 2411075, 2410001, 2500000].map(n => ({
    nis: n,
    email: `${n}@cimahi.tarunanusantara.sch.id`,
    password: getStudentPassword(n)
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium">Manajemen akun dan password siswa.</p>
          </div>
        </div>
        
        <button 
          onClick={downloadAllPasswords}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all"
        >
          {isDownloading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Download size={20} />
              Download Semua Akun (XLSX)
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Search Tool */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Search size={20} className="text-blue-600" /> Cari Akun
          </h2>
          <form onSubmit={handleCheck} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Masukkan NIS Siswa</label>
              <input 
                type="number" 
                required 
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Contoh: 2410880"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
            >
              Generate Password
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Email Sekolah</p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                    <code className="text-sm font-bold text-slate-800">{result.email}</code>
                    <button onClick={() => copyToClipboard(result.email)} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Password</p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                    <code className="text-sm font-bold text-slate-800">{result.password}</code>
                    <button onClick={() => copyToClipboard(result.password)} className="text-slate-400 hover:text-blue-600 transition-colors">
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Examples List */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Key size={20} className="text-blue-600" /> Contoh Akun
          </h2>
          <div className="space-y-4">
            {examples.map((ex) => (
              <div key={ex.nis} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-800">{ex.nis}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email</p>
                  <p className="text-xs font-mono text-slate-600 truncate">{ex.email}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-2">Password</p>
                  <p className="text-xs font-mono font-bold text-blue-600">{ex.password}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-400 italic leading-relaxed">
            * Password dihasilkan secara deterministik menggunakan algoritma cipher Tarnus. Setiap NIS memiliki password unik yang tetap.
          </p>
        </div>
      </div>
    </div>
  );
}
