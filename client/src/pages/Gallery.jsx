import { useState } from 'react'
import { mockGallery } from '../utils/mockData'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = ['all', ...new Set(mockGallery.map(item => item.category))]
  const filtered = selectedCategory === 'all' ? mockGallery : mockGallery.filter(item => item.category === selectedCategory)

  return (
    <div>
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-300">Explore moments from our journey and events</p>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full capitalize transition ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-md bg-white">
                <img src={item.image} alt={item.title} className="w-full h-64 object-cover transition-transform group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery