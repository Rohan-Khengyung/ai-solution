import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { getGalleryItems } from '../services/api';

// Placeholder component for images (or use a real image component)
const ImagePlaceholder = ({ className, label }) => (
  <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
    <span className="text-gray-400 text-sm">{label}</span>
  </div>
);

const Events = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upcoming events – can be fetched from an API later, for now static with rich details
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
    },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryItems();
        // Use all gallery items or filter by 'event' category if needed
        setGalleryItems(res.data.data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Transform gallery items to match the expected format (caption, year)
  const formattedGallery = galleryItems.map(item => ({
    _id: item._id,
    caption: item.title,
    year: new Date(item.createdAt).getFullYear(),
    image: item.image,
  }));

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Community</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Events & Gallery</h1>
          <p className="text-lg text-gray-500">
            Register for upcoming events and explore highlights from our past conferences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Upcoming Events */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Don't Miss Out</p>
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white flex flex-col md:flex-row md:items-stretch hover:shadow-md transition-shadow duration-200"
              >
                {/* Date block */}
                <div className="md:w-28 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-row md:flex-col items-center justify-between md:justify-center p-4 text-center gap-2 md:gap-0">
                  <span className="text-2xl font-bold text-gray-900 leading-none">{event.day}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{event.month}</span>
                  <span className="text-xs text-gray-400">{event.year}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
                        {event.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {event.day} {event.month} {event.year}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 text-sm font-bold rounded hover:bg-blue-700 transition-colors duration-150">
                      Register Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-20" />

        {/* Photo Gallery */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Archive</p>
              <h2 className="text-3xl font-bold text-gray-900">Photo Gallery</h2>
            </div>
            <p className="text-sm text-gray-400">Highlights from past events and conferences</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading gallery...</div>
          ) : formattedGallery.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No gallery images available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formattedGallery.map((item) => (
                <div
                  key={item._id}
                  className="group border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="relative overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full aspect-video object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <ImagePlaceholder className="aspect-video" label={`Photo`} />
                    )}
                    <div className="absolute inset-0 bg-gray-900 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                  </div>
                  <div className="p-4 flex items-start justify-between bg-white">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.caption}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.year}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/gallery" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              View full gallery → <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Events;