import { useState, useEffect } from 'react';
import { getGalleryItems } from '../services/api';
import { X, ZoomIn } from 'lucide-react';

// Helper to extract year from date string
const getYearFromDate = (dateString) => {
  if (!dateString) return new Date().getFullYear().toString();
  return new Date(dateString).getFullYear().toString();
};

// Predefined color map for consistent category styling
const CATEGORY_COLORS = {
  Conference: 'bg-blue-100 text-blue-700',
  Workshop: 'bg-violet-100 text-violet-700',
  Expo: 'bg-emerald-100 text-emerald-700',
  Awards: 'bg-amber-100 text-amber-700',
  Networking: 'bg-rose-100 text-rose-700',
  Launch: 'bg-cyan-100 text-cyan-700',
  Team: 'bg-indigo-100 text-indigo-700',
  Product: 'bg-purple-100 text-purple-700',
  Event: 'bg-pink-100 text-pink-700',
  Default: 'bg-gray-100 text-gray-600',
};

const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Default;
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  
  // Always show these categories even if no items have them (for UI consistency)
  const defaultCategories = ['All', 'Conference', 'Workshop', 'Expo', 'Awards', 'Networking', 'Launch'];
  const defaultYears = ['All', '2026', '2025', '2024'];
  
  const [categories, setCategories] = useState(defaultCategories);
  const [years, setYears] = useState(defaultYears);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryItems();
        const data = res.data.data;

        // Enrich items with computed year
        const enriched = data.map(item => ({
          ...item,
          year: getYearFromDate(item.createdAt),
        }));

        // Extract unique categories and years from actual data
        const uniqueCategoriesFromData = [...new Set(enriched.map(i => i.category).filter(Boolean))];
        const uniqueYearsFromData = [...new Set(enriched.map(i => i.year))].sort().reverse();
        
        // Merge with defaults to ensure buttons are always visible
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
      {/* Dark Hero Header - same as example */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0055FF] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Visual Archive</p>
          <h1 className="text-5xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-lg text-gray-400 max-w-xl">
            Browse highlights from our conferences, workshops, product launches, and community events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Filters - Always visible */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium border transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-[#0055FF] text-white border-[#0055FF]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat === 'All' ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-200 mx-2" />
          <div className="flex gap-2 flex-wrap">
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                className={`px-3 py-2 text-sm font-medium border transition-all duration-150 ${
                  activeYear === yr
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-400">{filtered.length} photos</span>
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#0055FF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No photos match the selected filters.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((item) => (
              <div
                key={item._id}
                onClick={() => setLightbox(item)}
                className="group break-inside-avoid border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: '4/3' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      <ZoomIn className="w-4 h-4" />
                      <span className="text-xs font-medium">View photo</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 leading-snug">{item.title}</p>
                    <span
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}
                    >
                      {item.year}
                    </span>
                  </div>
                  {item.category && (
                    <span
                      className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white max-w-3xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={lightbox.image}
                alt={lightbox.title}
                className="w-full h-auto max-h-[60vh] object-contain bg-gray-100"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">{lightbox.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {lightbox.category} · {lightbox.year}
                </p>
                {lightbox.description && (
                  <p className="text-sm text-gray-500 mt-1">{lightbox.description}</p>
                )}
              </div>
              {lightbox.category && (
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${getCategoryColor(lightbox.category)}`}
                >
                  {lightbox.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;