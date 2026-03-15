import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, X, BookOpen, FileText } from 'lucide-react';
import { GENRES } from '../constants';
import { saveWork, savePages } from '../data';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('comic');
  const [genre, setGenre] = useState(GENRES[0]);
  const [authorName, setAuthorName] = useState('');
  const [authorBatch, setAuthorBatch] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPage = () => {
    setPages([...pages, '']);
  };

  const updatePage = (index: number, content: string) => {
    const newPages = [...pages];
    newPages[index] = content;
    setPages(newPages);
  };

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage || pages.length === 0) {
      setMessage({ type: 'error', text: 'Sampul dan minimal satu halaman wajib diisi!' });
      return;
    }

    setLoading(true);
    try {
      // Use local save instead of API call
      const newWork = saveWork({
        title, type, genre, author_name: authorName, author_batch: authorBatch,
        cover_image: coverImage
      });
      
      savePages(newWork.id, pages);
      
      setMessage({ type: 'success', text: 'Karya berhasil diunggah!' });
      // Reset form
      setTitle(''); setPages([]); setCoverImage(''); setAuthorName(''); setAuthorBatch('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal mengunggah karya.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-slate-200 my-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Upload className="mr-3 text-blue-600" /> Upload Karya Baru
        </h2>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center font-bold">
          <X className="mr-1" size={20} /> Tutup
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Karya</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan judul..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tipe</label>
                <select 
                  value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="comic">Comic</option>
                  <option value="novel">Novel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Genre</label>
                <select 
                  value={genre} onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {GENRES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penulis (Siswa)</label>
                <input 
                  type="text" required value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nama lengkap..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Angkatan TN</label>
                <input 
                  type="text" required value={authorBatch} onChange={(e) => setAuthorBatch(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Contoh: TN 34"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sampul (Cover)</label>
            <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden group">
              {coverImage ? (
                <>
                  <img src={coverImage} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setCoverImage('')} className="bg-red-500 p-2 rounded-full text-white"><Trash2 size={20}/></button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center p-6 text-center">
                  <Upload className="text-slate-400 mb-3" size={40} />
                  <span className="text-sm font-bold text-slate-500">Klik untuk upload sampul</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, setCoverImage)} />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              {type === 'comic' ? <BookOpen className="mr-2" /> : <FileText className="mr-2" />}
              Konten Halaman
            </h3>
            <button 
              type="button" onClick={addPage}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center hover:bg-blue-100 transition-colors"
            >
              <Plus size={18} className="mr-1" /> Tambah Halaman
            </button>
          </div>

          <div className="space-y-6">
            {pages.map((content, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <span className="text-xs font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">HAL {index + 1}</span>
                  <button type="button" onClick={() => removePage(index)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                </div>
                
                {type === 'comic' ? (
                  <div className="mt-4">
                    {content ? (
                      <div className="relative w-full max-w-xs aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-sm">
                        <img src={content} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => updatePage(index, '')} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full text-white shadow-lg"><X size={14}/></button>
                      </div>
                    ) : (
                      <label className="w-full max-w-xs aspect-[3/4] bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-colors">
                        <Upload className="text-slate-300 mb-2" />
                        <span className="text-xs font-bold text-slate-400">Upload Gambar Halaman</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, (b64) => updatePage(index, b64))} />
                      </label>
                    )}
                  </div>
                ) : (
                  <textarea 
                    value={content} onChange={(e) => updatePage(index, e.target.value)}
                    className="w-full mt-4 p-4 bg-white border border-slate-200 rounded-xl min-h-[200px] outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tulis isi novel untuk halaman ini..."
                  />
                )}
              </div>
            ))}
            
            {pages.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">Belum ada halaman. Klik "Tambah Halaman" untuk memulai.</p>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="mr-2" /> Publikasikan Karya</>}
        </button>
      </form>
    </div>
  );
}
