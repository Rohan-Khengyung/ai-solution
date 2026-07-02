import { useState, useEffect } from 'react';
import { getAllTrainings, createTraining, updateTraining, deleteTraining } from '../../services/api';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminTrainingManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', subtitle: '', description: '', duration: '', format: '', audience: '',
    keyTopics: [], icon: '', learnMoreLink: '#contact', isActive: true, order: 0
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getAllTrainings();
      setItems(res.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ title: '', subtitle: '', description: '', duration: '', format: '', audience: '', keyTopics: [], icon: '', learnMoreLink: '#contact', isActive: true, order: 0 });
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, keyTopics: form.keyTopics.filter(k => k) };
      if (editing) {
        await updateTraining(editing._id, payload);
      } else {
        await createTraining(payload);
      }
      fetchItems();
      setShowModal(false);
      resetForm();
    } catch (err) { alert('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this training?')) {
      await deleteTraining(id);
      fetchItems();
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Management</h2>
          <p className="text-sm text-gray-500 mt-1">{items.length} total trainings</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-[#0055FF] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Training
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Title</th>
              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Subtitle</th>
              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Duration</th>
              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map(item => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.subtitle}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.duration}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(item); setForm(item); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 transition" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 transition" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="text-center text-gray-400 py-12"><p>No trainings found</p></div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit' : 'Add'} Training</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded"><X size={24} className="text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtitle *</label>
                <input type="text" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description *</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Duration *</label>
                <input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Format *</label>
                <input type="text" value={form.format} onChange={e => setForm({...form, format: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Audience *</label>
                <input type="text" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Icon Name *</label>
                <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" required />
                <p className="text-xs text-gray-400 mt-1">Use icon name from Lucide (e.g., Brain, Cpu, Zap)</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Learn More Link</label>
                <input type="text" value={form.learnMoreLink} onChange={e => setForm({...form, learnMoreLink: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Key Topics (comma separated) *</label>
                <input type="text" value={form.keyTopics.join(', ')} onChange={e => setForm({...form, keyTopics: e.target.value.split(',').map(s => s.trim())})} className="w-full border border-gray-200 rounded px-4 py-2" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Order</label>
                <input type="number" value={form.order} onChange={e => setForm({...form, order: Number(e.target.value)})} className="w-full border border-gray-200 rounded px-4 py-2" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="accent-[#0055FF]" /> Active
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#0055FF] text-white rounded hover:bg-blue-700 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainingManagement;