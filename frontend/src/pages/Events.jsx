import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { getGalleryItems } from '../services/api';

const ImagePlaceholder = ({ className, label }) => (
  <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
    <ImageIcon className="w-8 h-8 text-gray-400" />
    <span className="text-gray-400 text-sm ml-2">{label}</span>
  </div>
);

const Events = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const upcomingEvents = [
    {
      day: '15–17',
      month: 'JUN',
      year: '2026',
      name: 'AI Innovation Summit 2026',
      location: 'San Francisco, CA',
      type: 'Conference',
      description:
        'Join industry leaders to explore the latest in AI technology and innovation. Two days of talks, workshops, and networking.',
      gradient: 'from-indigo-50 to-blue-50',
    },
    {
      day: '08',
      month: 'JUL',
      year: '2026',
      name: 'Virtual Assistant Workshop',
      location: 'Online Webinar',
      type: 'Workshop',
      description:
        'Hands-on workshop demonstrating how to implement AI assistants in your organization effectively.',
      gradient: 'from-purple-50 to-pink-50',
    },
    {
      day: '22–23',
      month: 'AUG',
      year: '2026',
      name: 'Automation Excellence Conference',
      location: 'New York, NY',
      type: 'Conference',
      description:
        'Learn best practices for business process automation and digital transformation from leading practitioners.',
      gradient: 'from-emerald-50 to-teal-50',
    },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryItems();
        setGalleryItems(res.data.data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const formattedGallery = galleryItems.map(item => ({
    _id: item._id,
    caption: item.title,
    year: new Date(item.createdAt).getFullYear(),
    image: item.image,
  }));

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Page Header – vibrant gradient with animated blobs */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/70">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Community</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Events <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">& Gallery</span>
          </h1>
          <p className="text-lg text-gray-600">
            Register for upcoming events and explore highlights from our past conferences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Upcoming Events */}
        <section className="mb-20 reveal">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
                <span className="w-6 h-px bg-indigo-300"></span>
                Don't Miss Out
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
          </div>

          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-r ${event.gradient} border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex flex-col md:flex-row md:items-stretch">
                  {/* Date block – enhanced with gradient background */}
                  <div className="md:w-32 flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-row md:flex-col items-center justify-between md:justify-center p-5 text-center gap-2 md:gap-0">
                    <span className="text-3xl font-black text-white leading-none">{event.day}</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-indigo-200">{event.month}</span>
                    <span className="text-xs text-indigo-300">{event.year}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          {event.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {event.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-500" /> {event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-indigo-500" /> {event.day} {event.month} {event.year}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="group/btn relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                        Register Now
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-0 group-hover/btn:opacity-40 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative Divider */}
        <div className="relative my-20">
          <div className="absolute left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
        </div>

        {/* Photo Gallery */}
        <section className="reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
                <span className="w-6 h-px bg-indigo-300"></span>
                Archive
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Highlights from past events and conferences
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="mt-3 text-gray-500">Loading gallery...</p>
            </div>
          ) : formattedGallery.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No gallery images available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {formattedGallery.map((item, idx) => (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="relative overflow-hidden aspect-video">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <ImagePlaceholder className="w-full h-full" label={`Photo`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5 flex items-start justify-between bg-white">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {item.caption}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.year}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group transition-colors"
            >
              View full gallery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        .reveal {
          opacity: 0;
          transform: translateY(30px);
        }
        .animate-fade-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </>
  );
};

export default Events;