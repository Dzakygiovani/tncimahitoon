import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MessageSquare, Send, User } from 'lucide-react';

export default function Reader({ workId, userId, onBack }: { workId: number, userId: number, onBack: () => void }) {
  const [data, setData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    fetch(`/api/works/${workId}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      });
  }, [workId]);

  const handleNext = () => {
    if (currentPage < data.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setHasFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const submitRating = async (val: number) => {
    if (!hasFinished) return;
    setRating(val);
    await fetch(`/api/works/${workId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rating: val }),
    });
  };

  const submitComment = async () => {
    if (!hasFinished || !comment.trim()) return;
    const res = await fetch(`/api/works/${workId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content: comment }),
    });
    if (res.ok) {
      setComment('');
      // Refresh data to show new comment
      const newData = await (await fetch(`/api/works/${workId}`)).json();
      setData(newData);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const { work, pages, comments } = data;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center text-slate-300 hover:text-white font-bold">
          <ChevronLeft className="mr-1" /> Kembali
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg line-clamp-1">{work.title}</h2>
          <p className="text-xs text-slate-400">Halaman {currentPage + 1} dari {pages.length}</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-10 overflow-auto">
        <div className="max-w-4xl w-full bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
          {work.type === 'comic' ? (
            <img src={pages[currentPage].content} className="w-full h-auto object-contain" />
          ) : (
            <div className="p-10 md:p-16 text-lg leading-relaxed font-serif whitespace-pre-wrap">
              {pages[currentPage].content}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800 p-6 flex justify-center space-x-4 sticky bottom-0">
        <button 
          onClick={handlePrev} disabled={currentPage === 0}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Sebelumnya
        </button>
        <button 
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-colors"
        >
          {currentPage === pages.length - 1 ? 'Selesai Membaca' : 'Selanjutnya'}
        </button>
      </div>

      {/* Rating & Comments Modal/Section (Visible after finishing) */}
      {hasFinished && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white text-slate-800 w-full max-w-2xl rounded-3xl p-8 shadow-2xl my-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold">Selesai Membaca!</h3>
                <p className="text-slate-500">Bagaimana menurutmu karya ini?</p>
              </div>
              <button onClick={() => setHasFinished(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>

            <div className="mb-10 text-center">
              <p className="font-bold text-slate-700 mb-4">Beri Rating</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => submitRating(v)} className="transition-transform hover:scale-110">
                    <Star size={40} className={v <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <p className="font-bold text-slate-700 mb-4 flex items-center">
                <MessageSquare className="mr-2 text-blue-600" size={20} /> Komentar
              </p>
              <div className="flex space-x-3">
                <input 
                  type="text" value={comment} onChange={(e) => setComment(e.target.value)}
                  className="flex-grow bg-slate-100 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tulis komentarmu..."
                />
                <button onClick={submitComment} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                  <Send size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
              {comments.map((c: any) => (
                <div key={c.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{c.user_email}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-center text-slate-400 italic text-sm">Belum ada komentar.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
