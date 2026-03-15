import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-8 space-y-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 border-b pb-4">About Us</h1>
        
        <div className="prose prose-slate max-w-none text-slate-700 space-y-6">
          <p>
            <strong>LIVO (Library Volunteers)</strong> merupakan salah satu unit kegiatan yang berada di bawah naungan <strong>SIEKOM 8</strong> OSIS/MPK SMA Taruna Nusantara Kampus Cimahi, yang secara struktural berada di bawah koordinasi <strong>Ketua 3 OSIS/MPK</strong>.
          </p>

          <p>
            LIVO berperan dalam mendukung pengembangan budaya literasi di lingkungan sekolah. Kegiatan yang dijalankan tidak hanya berfokus pada literasi digital, tetapi juga mencakup pengelolaan dan pengembangan kegiatan yang berkaitan dengan perpustakaan sekolah. LIVO turut berperan dalam membantu pengelolaan buku perpustakaan, penataan koleksi bacaan, serta mendukung berbagai program yang bertujuan untuk meningkatkan minat baca siswa.
          </p>

          <p>
            Selain itu, LIVO juga menjadi wadah bagi siswa untuk menyalurkan kreativitas dan inovasi dalam bidang literasi, baik melalui karya tulis, media kreatif, maupun kegiatan lain yang mendukung berkembangnya budaya membaca, menulis, dan berpikir kreatif di lingkungan SMA Taruna Nusantara Kampus Cimahi.
          </p>

          <p>
            Dengan adanya LIVO, diharapkan tercipta lingkungan sekolah yang lebih aktif dalam kegiatan literasi, serta tumbuhnya minat baca dan semangat berkarya di kalangan siswa.
          </p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Akun Media Sosial</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <a 
              href="https://www.instagram.com/ospektn.cimahi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-600 hover:text-pink-600 transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-full group-hover:bg-pink-50 transition-colors">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="font-medium">Instagram</span>
            </a>
            
            <a 
              href="https://www.youtube.com/watch?v=PVasIArDgUM&t=8s" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-full group-hover:bg-red-50 transition-colors">
                <Youtube className="w-6 h-6" />
              </div>
              <span className="font-medium">Youtube</span>
            </a>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Struktur Organisasi LIVO</h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-center">
            <img 
              src="https://i.pinimg.com/736x/b2/e8/0c/b2e80c646493083124a309cf38ee92e9.jpg" 
              alt="Struktur Organisasi LIVO" 
              className="max-w-full h-auto rounded-lg shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
