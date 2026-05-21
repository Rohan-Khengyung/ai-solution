// src/pages/Events.jsx
import { useState, useEffect } from 'react';
import { getGalleryItems } from '../services/api';
import { Link } from 'react-router-dom';

const Events = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upcoming events – can be fetched from an API later, for now static
  const upcomingEvents = [
    { id: 1, date: 'June 15–17, 2026', topic: 'AI Innovation Summit 2026', location: 'Kathmandu, Nepal', registerLink: '#' },
    { id: 2, date: 'July 22, 2026', topic: 'Automation Masterclass', location: 'Online Webinar', registerLink: '#' },
    { id: 3, date: 'August 10, 2026', topic: 'AI in Enterprise – Panel Discussion', location: 'San Francisco, CA', registerLink: '#' },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryItems();
        // Filter only events category or show all
        setGalleryItems(res.data.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-blue-600 font-semibold uppercase tracking-wide">COMMUNITY</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Events & Gallery</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Register for upcoming events and explore highlights from our past conferences.
        </p>
      </div>

      {/* Upcoming Events Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-600 w-2 h-8 rounded-full"></span> Don't Miss Out
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="hidden md:grid grid-cols-4 bg-gray-100 p-4 font-semibold">
            <div>DATE</div>
            <div>TOPIC</div>
            <div>LOCATION</div>
            <div></div>
          </div>
          {upcomingEvents.map((event) => (
            <div key={event.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-t items-center">
              <div className="font-semibold md:font-normal">{event.date}</div>
              <div className="text-blue-600 font-medium">{event.topic}</div>
              <div className="text-gray-600">{event.location}</div>
              <div>
                <a
                  href={event.registerLink}
                  className="inline-block bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm text-center"
                >
                  Register Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-600 w-2 h-8 rounded-full"></span> Photo Gallery
        </h2>
        <p className="text-gray-600 mb-8">Highlights from past events and conferences</p>

        {loading ? (
          <div className="text-center py-12">Loading gallery...</div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No gallery images available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item._id} className="group relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/gallery" className="text-blue-600 hover:underline inline-flex items-center gap-1">
            View full gallery →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Events;