import { useState, useEffect } from 'react';
import { getGalleryItems } from '../services/api';
import { X, ZoomIn, Calendar, Tag, Sparkles } from 'lucide-react';

// Helper to extract year from date string
const getYearFromDate = (dateString) => {
  if (!dateString) return new Date().getFullYear().toString();
  return new Date(dateString).getFullYear().toString();
};

// Enhanced category colors with gradients
const CATEGORY_STYLES = {
  Conference: { bg: 'bg-gradient-to-r from-blue-500 to-indigo-500', text: 'text-white', badge: 'from-blue-500 to-indigo-500' },
  Workshop: { bg: 'bg-gradient-to-r from-violet-500 to-purple-500', text: 'text-white', badge: 'from-violet-500 to-purple-500' },
  Expo: { bg: 'bg-gradient-to-r from-emerald-500 to-teal-500', text: 'text-white', badge: 'from-emerald-500 to-teal-500' },
  Awards: { bg: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'text-white', badge: 'from-amber-500 to-orange-500' },
  Networking: { bg: 'bg-gradient-to-r from-rose-500 to-pink-500', text: 'text-white', badge: 'from-rose-500 to-pink-500' },
  Launch: { bg: 'bg-gradient-to-r from-cyan-500 to-sky-500', text: 'text-white', badge: 'from-cyan-500 to-sky-500' },
  Team: { bg: 'bg-gradient-to-r from-indigo-500 to-blue-500', text: 'text-white', badge: 'from-indigo-500 to-blue-500' },
  Product: { bg: 'bg-gradient-to-r from-purple-500 to-fuchsia-500', text: 'text-white', badge: 'from-purple-500 to-fuchsia-500' },
  Event: { bg: 'bg-gradient-to-r from-pink-500 to-rose-500', text: 'text-white', badge: 'from-pink-500 to-rose-500' },
  Default: { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', text: 'text-white', badge: 'from-gray-500 to-gray-600' },
};

const getCategoryStyle = (category) => {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.Default;
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  
  const defaultCategories = ['All', 'Conference', 'Workshop', 'Expo', 'Awards', 'Networking', 'Launch'];
  const defaultYears = ['All', '2026', '2025', '2024'];
  
  const [categories, setCategories] = useState(defaultCategories);
  const [years, setYears] = useState(defaultYears);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryItems();
        const data = res.data.data;
        const enriched = data.map(item => ({
          ...item,
          year: getYearFromDate(item.createdAt),
        }));
        const uniqueCategoriesFromData = [...new Set(enriched.map(i => i.category).filter(Boolean))];
        const uniqueYearsFromData = [...new Set(enriched.map(i => i.year))].sort().reverse();
        const allCategories = ['All', ...new Set([...uniqueCategoriesFromData, ...defaultCategories.slice(1)])];
        const allYears = ['All', ...new Set([...uniqueYearsFromData, ...defaultYears.slice(1)])].sort().reverse();
        setCategories(allCategories);
        setYears(allYears);
        setItems(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = items.filter(item => {
    const catMatch = activeCategory === 'All' || item.category === activeCategory;
    const yearMatch = activeYear === 'All' || item.year === activeYear;
    return catMatch && yearMatch;
  });

  return (
    <div className="bg-white">
      {/* Hero Header – vibrant gradient with animated blobs */}
      <div className="relative overflow-hidden border-b border-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #a5b4fc 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 -right-32 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-24">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Visual Archive</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Photo <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Gallery</span>
          </h1>
          <p className="text-lg text-indigo-200 max-w-xl">
            Browse highlights from our conferences, workshops, product launches, and community events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Filters – animated, with gradient active states */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {cat === 'All' ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 blur-md opacity-40 -z-10" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <div className="flex gap-2 flex-wrap">
            {years.map((yr) => {
              const isActive = activeYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setActiveYear(yr)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
          <span className="ml-auto text-sm text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        {/* Masonry Grid with fade-in animation */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
              <ZoomIn className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No photos match the selected filters.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((item, idx) => {
              const categoryStyle = getCategoryStyle(item.category);
              return (
                <div
                  key={item._id}
                  onClick={() => setLightbox(item)}
                  className="group break-inside-avoid rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s both` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ aspectRatio: '4/3' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                      <div className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <ZoomIn className="w-4 h-4" />
                        <span className="text-xs font-medium">View</span>
                      </div>
                    </div>
                    {/* Category badge on image (corner) */}
                    {item.category && (
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-md ${categoryStyle.bg} text-white shadow-md`}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-bold text-gray-900 leading-tight">{item.title}</p>
                      <span className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal – enhanced with scale-in animation */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightbox(null)}
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative bg-gray-100">
              <img
                src={lightbox.image}
                alt={lightbox.title}
                className="w-full max-h-[65vh] object-contain"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{lightbox.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {lightbox.category && (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${getCategoryStyle(lightbox.category).bg} text-white`}>
                        <Tag className="w-3 h-3" />
                        {lightbox.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {lightbox.year}
                    </span>
                  </div>
                </div>
              </div>
              {lightbox.description && (
                <p className="text-gray-600 mt-4 leading-relaxed">{lightbox.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom keyframes for fade-in and scale animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Gallery;