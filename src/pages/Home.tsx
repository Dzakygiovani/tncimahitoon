import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Send, Book, Users, Eye, Layers, Star, Upload } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import Reader from '../components/Reader';
import { GENRES } from '../constants';

export default function Home({ user }: { user: any }) {
  const navigate = useNavigate();
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
  const [viewAll, setViewAll] = useState<'trending' | 'new' | null>(null);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = () => {
    setLoading(true);
    fetch('/api/works')
      .then(res => res.json())
      .then(data => {
        if (data.success) setWorks(data.works);
        setLoading(false);
      });
  };

  const handleWorkClick = (id: number) => {
    fetch(`/api/works/${id}/view`, { method: 'POST' });
    setSelectedWorkId(id);
  };

  if (selectedWorkId) {
    return <Reader workId={selectedWorkId} userId={user.id} onBack={() => { setSelectedWorkId(null); fetchWorks(); }} />;
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => { setShowAdmin(false); fetchWorks(); }} />;
  }

  if (viewAll) {
    const displayedWorks = viewAll === 'trending' ? works : works.filter(w => {
      const created = new Date(w.created_at);
      const now = new Date();
      return (now.getTime() - created.getTime()) < (7 * 24 * 60 * 60 * 1000);
    });

    return (
      <div className="min-h-screen bg-slate-50 font-sans p-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setViewAll(null)} className="mb-8 flex items-center text-slate-600 hover:text-blue-600 font-bold transition-colors">
            <ChevronRight className="rotate-180 mr-2" /> Kembali ke Beranda
          </button>
          <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
            <span className="w-2 h-8 bg-blue-600 mr-4 rounded-full"></span>
            {viewAll === 'trending' ? 'Semua Karya' : 'Karya Terbaru (7 Hari Terakhir)'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedWorks.map((work) => (
              <div key={work.id} className="group cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                <div className="relative overflow-hidden rounded-2xl shadow-md mb-4 aspect-[3/4] bg-slate-200">
                  <img src={work.cover_image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center text-xs font-bold text-slate-800 shadow-sm">
                    <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
                    {work.avg_rating ? Number(work.avg_rating).toFixed(1) : '0.0'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm bg-blue-600 px-4 py-2 rounded-lg w-full text-center">Baca Sekarang</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{work.title}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1.5 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-[10px] font-bold">TN</span>
                  {work.author_name} ({work.author_batch})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const trendingWorks = works.slice(0, 4);
  const newWorks = works.filter(w => {
    const created = new Date(w.created_at);
    const now = new Date();
    return (now.getTime() - created.getTime()) < (7 * 24 * 60 * 60 * 1000); // Last 7 days
  }).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.pinimg.com/736x/9d/78/f0/9d78f0795663da6665e3fb673565ce35.jpg" 
            alt="SMA TN Students" 
            className="w-full h-full object-cover opacity-60" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/40 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-block bg-sky-500/20 backdrop-blur-md border border-sky-400/30 px-4 py-1.5 rounded-full text-sky-300 text-sm font-bold mb-6 tracking-wide uppercase">
              Official Platform
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-white drop-shadow-2xl tracking-tight">
              Platform <span className="text-sky-400">Webtoon</span> & <span className="text-sky-400">Novel</span><br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold block mt-2 text-blue-50">Karya Siswa SMA Taruna Nusantara</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 font-medium text-blue-100 italic border-l-4 border-sky-400 pl-6 py-2 bg-blue-900/20 backdrop-blur-sm inline-block rounded-r-lg">
              Dari Siswa, Untuk Siswa.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => navigate('/comics')}
                className="group bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-xl flex items-center shadow-2xl shadow-orange-500/40 transition-all hover:-translate-y-1 active:scale-95"
              >
                Explore Comic 
                <div className="ml-3 bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </button>
              <button 
                onClick={() => navigate('/novels')}
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-bold text-xl flex items-center shadow-xl transition-all hover:-translate-y-1 border border-white/30 active:scale-95"
              >
                Explore Novel 
                <div className="ml-3 bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        
        {user.role === 'admin' && (
          <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-blue-600/20">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Halo Admin LIVO!</h2>
              <p className="text-blue-100">Anda memiliki akses untuk mengelola karya siswa.</p>
            </div>
            <button 
              onClick={() => setShowAdmin(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-blue-50 transition-all shadow-lg"
            >
              <Upload className="mr-2" size={20} /> Tambah Comic / Novel
            </button>
          </div>
        )}

        {/* Trending Section */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center">
              <span className="w-2 h-8 bg-orange-500 mr-4 rounded-full"></span>
              Trending Minggu Ini
            </h2>
            <button onClick={() => setViewAll('trending')} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center transition-colors">
              Lihat Semua <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trendingWorks.map((work) => (
              <div key={work.id} className="group cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                <div className="relative overflow-hidden rounded-2xl shadow-md mb-4 aspect-[3/4] bg-slate-200">
                  <img src={work.cover_image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center text-xs font-bold text-slate-800 shadow-sm">
                    <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
                    {work.avg_rating ? Number(work.avg_rating).toFixed(1) : '0.0'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm bg-blue-600 px-4 py-2 rounded-lg w-full text-center">Baca Sekarang</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{work.title}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1.5 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-[10px] font-bold">TN</span>
                  {work.author_name} ({work.author_batch})
                </p>
              </div>
            ))}
            {trendingWorks.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Belum ada karya yang diunggah.</p>
              </div>
            )}
          </div>
        </section>

        {/* Terbaru Section */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center">
              <span className="w-2 h-8 bg-blue-500 mr-4 rounded-full"></span>
              Terbaru
            </h2>
            <button onClick={() => setViewAll('new')} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center transition-colors">
              Lihat Semua <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {newWorks.map((work) => (
              <div key={`new-${work.id}`} className="group cursor-pointer" onClick={() => handleWorkClick(work.id)}>
                <div className="relative overflow-hidden rounded-2xl shadow-md mb-4 aspect-[3/4] bg-slate-200">
                  <img src={work.cover_image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-md shadow-lg tracking-wider">NEW</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm bg-blue-600 px-4 py-2 rounded-lg w-full text-center">Baca Sekarang</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{work.title}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1.5 font-medium">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2 text-[10px] font-bold">TN</span>
                  {work.author_name} ({work.author_batch})
                </p>
              </div>
            ))}
            {newWorks.length === 0 && !loading && works.length > 0 && (
              <div className="col-span-full py-12 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Tidak ada karya terbaru dalam 7 hari terakhir.</p>
              </div>
            )}
            {works.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Belum ada karya yang diunggah.</p>
              </div>
            )}
          </div>
        </section>

        {/* Middle Banner / Genre & Submit */}
        <section className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Book className="text-blue-600" size={20} />
              </div>
              Browse by Genre
            </h3>
            <div className="flex flex-wrap gap-3">
              {GENRES.map((genre) => (
                <button 
                  key={genre} 
                  onClick={() => navigate(`/browse?genre=${genre}`)}
                  className="px-5 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl font-semibold text-sm transition-all border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-6 -top-6 opacity-10 text-white transform rotate-12">
              <Send size={140} />
            </div>
            <h3 className="text-2xl font-bold mb-3 relative z-10 flex items-center">
              Kirim Karyamu!
            </h3>
            <p className="text-blue-100 text-sm mb-6 relative z-10 leading-relaxed">
              Punya karya komik atau novel yang ingin dipublikasikan? Kirimkan karyamu ke tim admin LIVO melalui email: <br/>
              <a href="mailto:dzakygiovani@gmail.com" className="font-bold text-sky-300 hover:text-white transition-colors mt-2 inline-block text-base">dzakygiovani@gmail.com</a>
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm w-full transition-all relative z-10 shadow-lg shadow-orange-500/20 flex justify-center items-center">
              Submit Your Work <ChevronRight size={18} className="ml-2" />
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center divide-x divide-slate-100">
            <div className="px-4">
              <div className="flex justify-center mb-4"><div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Book size={28} /></div></div>
              <div className="text-4xl font-black text-slate-800 mb-1">{works.length}</div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Karya Terbit</div>
            </div>
            <div className="px-4">
              <div className="flex justify-center mb-4"><div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Users size={28} /></div></div>
              <div className="text-4xl font-black text-slate-800 mb-1">
                {new Set(works.map(w => w.author_name.toLowerCase().trim())).size}
              </div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Penulis</div>
            </div>
            <div className="px-4">
              <div className="flex justify-center mb-4"><div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Eye size={28} /></div></div>
              <div className="text-4xl font-black text-slate-800 mb-1">
                {works.reduce((sum, work) => sum + (work.views || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Views</div>
            </div>
            <div className="px-4">
              <div className="flex justify-center mb-4"><div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Layers size={28} /></div></div>
              <div className="text-4xl font-black text-slate-800 mb-1">8</div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Genre</div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
