import React from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Award } from 'lucide-react';

export default function Profile({ user }: { user: any }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          
          <div className="relative z-10 pt-10">
            <div className="w-32 h-32 bg-white rounded-full mx-auto p-2 shadow-xl mb-6">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={64} />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-slate-800 mb-2">{user.role === 'admin' ? 'Administrator' : 'Siswa SMA TN'}</h1>
            <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
              <Mail size={16} />
              {user.email}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" /> Informasi Akun
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Role</span>
                <span className="font-bold text-slate-800 capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">ID Pengguna</span>
                <span className="font-mono font-bold text-slate-800">#{user.id}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Aktif
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Award size={20} className="text-blue-600" /> Aktivitas
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Karya Dibaca</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Komentar</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500 font-medium">Rating Diberikan</span>
                <span className="font-bold text-slate-800">0</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
