import { useState, useEffect } from 'react';
import { getGalleryItems } from '../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const params = category ? { category } : {};
        const res = await getGalleryItems({ params });
        setItems(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [category]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Photo Gallery</h1>
      <p className="text-center text-gray-600 mb-8">Highlights from past events and conferences</p>
      
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setCategory('')} className={`px-4 py-2 rounded ${!category ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
        <button onClick={() => setCategory('event')} className={`px-4 py-2 rounded ${category === 'event' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Events</button>
        <button onClick={() => setCategory('product')} className={`px-4 py-2 rounded ${category === 'product' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Products</button>
        <button onClick={() => setCategory('team')} className={`px-4 py-2 rounded ${category === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Team</button>
      </div>

      {loading ? (
        <p className="text-center">Loading gallery...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;