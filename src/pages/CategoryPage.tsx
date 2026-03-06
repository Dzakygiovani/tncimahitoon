import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import Reader from '../components/Reader';
import { GENRES } from '../constants';

interface CategoryPageProps {
  type?: 'comic' | 'novel';
  title: string;
  user: any;
}

export default function CategoryPage({ type, title, user }: CategoryPageProps) {
  const [searchParams] = useSearchParams();
  const genreParam = searchParams.get('genre');
  
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);

  useEffect(() => {
    fetchWorks();
  }, [type]); // Re-fetch if type changes

  const fetchWorks = () => {
    setLoading(true);
    fetch('/api/works')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          let filtered = data.works;
          if (type) {
            filtered = filtered.filter((w: any) => w.type === type);
          }
          setWorks(filtered);
        }
        setLoading(false);
      });
  };

  if (selectedWorkId) {
    return <Reader workId={selectedWorkId} userId={user.id} onBack={() => { setSelectedWorkId(null); fetchWorks(); }} />;
  }

  // If a specific genre is selected via query param
  if (genreParam) {
    const genreWorks = works.filter(w => w.genre === genreParam);
    
    return (
      <div className="min-h-screen bg-slate-50 font-sans p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to={type ? (type === 'comic' ? '/comics' : '/novels') : '/browse'} className="text-slate-500 hover:text-blue-600 mr-2 flex items-center">
              <span className="capitalize">{title}</span> <ChevronRight size={16} className="mx-1" />
            </Link>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">
              {genreParam}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {genreWorks.map((work) => (
                  <div key={work.id} className="group cursor-pointer" onClick={() => setSelectedWorkId(work.id)}>
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
              
              {genreWorks.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">Belum ada karya {genreParam} yang diunggah.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Default view: List all genres
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-12 flex items-center capitalize">
          <span className="w-2 h-8 bg-blue-600 mr-4 rounded-full"></span>
          {title}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {GENRES.map(genre => {
              const genreWorks = works.filter(w => w.genre === genre).slice(0, 5);
              if (genreWorks.length === 0) return null;

              return (
                <section key={genre}>
                  <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-2">
                    <h3 className="text-2xl font-bold text-slate-800">{genre}</h3>
                    <Link 
                      to={`?genre=${genre}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center transition-colors"
                    >
                      Lihat Semua <ChevronRight size={18} className="ml-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {genreWorks.map((work) => (
                      <div key={work.id} className="group cursor-pointer" onClick={() => setSelectedWorkId(work.id)}>
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
                </section>
              );
            })}
            
            {works.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Belum ada karya {type} yang diunggah.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
