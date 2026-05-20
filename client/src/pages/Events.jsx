import { Link } from 'react-router-dom'
import { mockEvents, mockGallery } from '../utils/mockData'

const Events = () => {
  const upcomingEvents = mockEvents
  const pastEventPhotos = mockGallery.filter(g => g.category === 'event').slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 font-semibold mb-2">COMMUNITY</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Register for upcoming events and explore highlights from our past conferences.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gray-50 rounded-xl shadow-sm">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-blue-600 font-semibold">{event.date}</p>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.location}</p>
                </div>
                <Link to="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">Register Now →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Photo Gallery</h2>
          <p className="text-center text-gray-600 mb-12">Highlights from past events and conferences</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pastEventPhotos.map(photo => (
              <div key={photo.id} className="group relative overflow-hidden rounded-xl shadow-md">
                <img src={photo.image} alt={photo.title} className="w-full h-64 object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <p className="text-white font-semibold text-lg">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="text-blue-600 font-semibold hover:text-blue-700">View Full Gallery →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events