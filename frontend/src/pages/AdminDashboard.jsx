import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu, LayoutDashboard, Inbox, Star, BookOpen, Image, Phone,
  Mail, LogOut, Search, Send, Check, X, Globe, Calendar, Plus, Edit, Trash2, ThumbsUp, ThumbsDown, Archive
} from 'lucide-react';
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getAllReviews,
  approveReview,
  deleteReview,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addGalleryItem,
  deleteGalleryItem,
  updateContactDetails,
  getContactDetails,
  getGalleryItems,
  getAllBlogsAdmin,
} from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Temporary helper for reject (replace with actual API call)
const updateReviewStatus = async (id, status) => {
  console.log(`Update review ${id} to ${status}`);
  // TODO: implement actual API call: await axios.put(`/api/admin/reviews/${id}/status`, { status });
  return Promise.resolve();
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);

  // --- State ---
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [blogPosts, setBlogPosts] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', image: '',
    author: 'AI Solutions Team', published: true, tags: []
  });
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryForm, setGalleryForm] = useState({
    title: '', image: '', category: 'event', description: '',
  });
  const [contact, setContact] = useState({
    email: '', phone: '', address: '', hours: '',
  });

  // --- Fetch functions ---
  const fetchEnquiries = async () => {
    try {
      const params = {};
      if (enquiryFilter) params.status = enquiryFilter;
      if (enquirySearch) params.search = enquirySearch;
      const res = await getEnquiries(params);
      setEnquiries(res.data.data);
    } catch (err) { console.error(err); alert('Failed to load enquiries'); }
  };
  const fetchReviews = async () => {
    try {
      const params = reviewFilter !== 'all' ? { status: reviewFilter } : {};
      const res = await getAllReviews(params);
      setReviews(res.data.data);
    } catch (err) { console.error(err); alert('Failed to load reviews'); }
  };
  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogsAdmin();
      setBlogPosts(res.data.data);
    } catch (err) { console.error(err); alert('Failed to load blog posts'); }
  };
  const fetchGallery = async () => {
    try {
      const res = await getGalleryItems();
      setGalleryItems(res.data.data);
    } catch (err) { console.error(err); alert('Failed to load gallery'); }
  };
  const fetchContact = async () => {
    try {
      const res = await getContactDetails();
      setContact(res.data.data);
    } catch (err) { console.error(err); alert('Failed to load contact details'); }
  };

  useEffect(() => {
    if (activeTab === 'enquiries' || activeTab === 'contact-details') fetchEnquiries();
    else if (activeTab === 'reviews') fetchReviews();
    else if (activeTab === 'blog') fetchBlogs();
    else if (activeTab === 'gallery') fetchGallery();
    else if (activeTab === 'contact') fetchContact();
  }, [activeTab, enquiryFilter, enquirySearch, reviewFilter]);

  // --- Enquiry handlers (including bulk actions)---
  const handleStatusChange = async (id, status) => {
    try { await updateEnquiryStatus(id, status); fetchEnquiries(); }
    catch (err) { alert('Failed to update status'); }
  };
  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Delete this enquiry?')) {
      try { await deleteEnquiry(id); fetchEnquiries(); }
      catch (err) { alert('Failed to delete enquiry'); }
    }
  };

  const handleSelectOne = (id) => {
    setSelectedEnquiries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const handleSelectAll = (checked) => {
    if (checked) setSelectedEnquiries(enquiries.map(e => e._id));
    else setSelectedEnquiries([]);
  };
  const handleBulkStatus = async (status) => {
    if (!selectedEnquiries.length) return;
    if (window.confirm(`Mark ${selectedEnquiries.length} enquiry(ies) as ${status}?`)) {
      for (const id of selectedEnquiries) await updateEnquiryStatus(id, status);
      fetchEnquiries();
      setSelectedEnquiries([]);
      alert(`Updated ${selectedEnquiries.length} enquiries.`);
    }
  };
  const handleBulkDelete = async () => {
    if (!selectedEnquiries.length) return;
    if (window.confirm(`Delete ${selectedEnquiries.length} enquiry(ies) permanently?`)) {
      for (const id of selectedEnquiries) await deleteEnquiry(id);
      fetchEnquiries();
      setSelectedEnquiries([]);
      alert(`Deleted ${selectedEnquiries.length} enquiries.`);
    }
  };

  // --- Review handlers ---
  const handleApproveReview = async (id) => {
    try { await approveReview(id); fetchReviews(); }
    catch (err) { alert('Failed to approve review'); }
  };
  const handleRejectReview = async (id) => {
    if (!window.confirm('Reject this review?')) return;
    try { await updateReviewStatus(id, 'rejected'); fetchReviews(); }
    catch (err) { alert('Failed to reject review'); }
  };
  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review permanently?')) {
      try { await deleteReview(id); fetchReviews(); }
      catch (err) { alert('Failed to delete review'); }
    }
  };

  // --- Blog handlers ---
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.image) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      if (editingBlog) await updateBlogPost(editingBlog._id, blogForm);
      else await createBlogPost(blogForm);
      alert(editingBlog ? 'Blog updated!' : 'Blog published!');
      setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'AI Solutions Team', published: true, tags: [] });
      setEditingBlog(null);
      await fetchBlogs();
    } catch (err) { alert('Failed to save blog post'); }
  };
  const handleEditBlog = (post) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title, excerpt: post.excerpt, content: post.content,
      image: post.image, author: post.author, published: post.published,
      tags: post.tags || []
    });
  };
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try { await deleteBlogPost(id); await fetchBlogs(); }
      catch (err) { alert('Failed to delete blog'); }
    }
  };

  // --- Gallery handlers ---
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.image) { alert('Title and Image URL are required'); return; }
    try {
      await addGalleryItem(galleryForm);
      setGalleryForm({ title: '', image: '', category: 'event', description: '' });
      await fetchGallery();
      alert('Gallery item added');
    } catch (err) { alert('Failed to add gallery item'); }
  };
  const handleDeleteGallery = async (id) => {
    if (window.confirm('Delete this gallery item?')) {
      try { await deleteGalleryItem(id); await fetchGallery(); }
      catch (err) { alert('Failed to delete gallery item'); }
    }
  };

  // --- Contact info handlers ---
  const handleContactUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateContactDetails(contact);
      alert('Contact details updated!');
    } catch (err) { alert('Failed to update contact details'); }
  };

  // Reply via email
  const handleReplyEmail = (email, name, jobDetails) => {
    const subject = `Reply to your enquiry - AI Solutions`;
    const body = `Dear ${name},\n\nThank you for your enquiry. We will get back to you shortly.\n\nYour enquiry details:\n${jobDetails}\n\nBest regards,\nAI Solutions Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Analytics
  const getMonthlyEnquiries = () => {
    const monthMap = {};
    enquiries.forEach(enq => {
      const date = new Date(enq.createdAt);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthMap[monthYear] = (monthMap[monthYear] || 0) + 1;
    });
    return Object.entries(monthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count }));
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const publishedPosts = blogPosts.filter(p => p.published).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: Inbox, badge: newEnquiries },
    { id: 'contact-details', label: 'Contact Details', icon: Mail, badge: enquiries.length },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: pendingReviews },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'contact', label: 'Contact Info', icon: Phone },
  ];

  const getBlogCategory = (post) => (post.tags && post.tags[0]) || 'Article';

  const reviewCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
          <div className="px-5 py-5 border-b border-gray-700">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 border-2 border-white/90 flex items-center justify-center rounded-sm">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                  <rect x="9" y="1" width="6" height="6" stroke="white" strokeWidth="1.5" />
                  <rect x="1" y="9" width="6" height="6" stroke="#0055FF" strokeWidth="1.5" />
                  <rect x="9" y="9" width="6" height="6" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-white">AI Solutions</p>
                <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 px-3 py-2">Navigation</p>
            {navItems.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm text-left transition-colors ${
                  activeTab === id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="bg-[#0055FF] text-white text-xs px-1.5 py-0.5 rounded-sm font-bold">{badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-gray-700">
            <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 text-sm font-medium hover:text-white hover:bg-gray-800 w-full rounded-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Main content – unchanged */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 border border-gray-200 hover:bg-gray-50">
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-bold text-gray-900 capitalize">
              {activeTab === 'contact-details' ? 'Contact Details' : activeTab} Management
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0055FF] to-indigo-600 flex items-center justify-center text-xs font-bold text-white">A</div>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* All existing JSX for tabs – unchanged – same as original */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Total Enquiries</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#0055FF] to-indigo-600 bg-clip-text text-transparent">{enquiries.length}</div>
                  <p className="text-xs text-gray-400 mt-1">{newEnquiries} new</p>
                </div>
                <div className="bg-white border border-gray-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Pending Reviews</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{pendingReviews}</div>
                  <p className="text-xs text-gray-400 mt-1">{reviews.filter(r => r.status === 'approved').length} approved</p>
                </div>
                <div className="bg-white border border-gray-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Blog Posts</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">{blogPosts.length}</div>
                  <p className="text-xs text-gray-400 mt-1">{publishedPosts} published</p>
                </div>
                <div className="bg-white border border-gray-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Gallery Items</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">{galleryItems.length}</div>
                  <p className="text-xs text-gray-400 mt-1">total media</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Enquiries per Month</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getMonthlyEnquiries()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0055FF" name="Number of Enquiries" />
                  </BarChart>
                </ResponsiveContainer>
                {getMonthlyEnquiries().length === 0 && (
                  <p className="text-center text-gray-400 py-8">No data yet</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900">Recent Enquiries</h3>
                    <button onClick={() => setActiveTab('enquiries')} className="text-xs text-[#0055FF] font-medium hover:underline">View all</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {enquiries.slice(0, 4).map((e) => (
                      <div key={e._id} className="px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-[#0055FF] flex-shrink-0">{e.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{e.name}</p>
                          <p className="text-xs text-gray-400 truncate">{e.company}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${e.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{e.status}</span>
                      </div>
                    ))}
                    {enquiries.length === 0 && <div className="px-5 py-8 text-center text-xs text-gray-400">No enquiries yet</div>}
                  </div>
                </div>
                <div className="bg-white border border-gray-200">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900">Pending Reviews</h3>
                    <button onClick={() => setActiveTab('reviews')} className="text-xs text-[#0055FF] font-medium hover:underline">View all</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {reviews.filter(r => r.status === 'pending').slice(0, 4).map((r) => (
                      <div key={r._id} className="px-5 py-3 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0">{r.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{r.name}</p>
                          <div className="flex gap-0.5 my-0.5">
                            {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-400 truncate italic">"{r.comment}"</p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => handleApproveReview(r._id)} className="p-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteReview(r._id)} className="p-1 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {reviews.filter(r => r.status === 'pending').length === 0 && <div className="px-5 py-8 text-center text-xs text-gray-400">No pending reviews</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Enquiries Management</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {enquiries.length} total enquiries · {enquiries.filter(e => e.status === 'new').length} new · {enquiries.filter(e => e.status === 'processed').length} processed
                </p>
              </div>
          
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex-1 min-w-[200px] relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        placeholder="Search by name, email or company..."
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]"
                      />
                    </div>
                    <select
                      value={enquiryFilter}
                      onChange={(e) => setEnquiryFilter(e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#0055FF]"
                    >
                      <option value="">All Statuses</option>
                      <option value="new">New</option>
                      <option value="processed">Processed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  {selectedEnquiries.length > 0 && (
                    <div className="flex gap-2 items-center bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">{selectedEnquiries.length} selected</span>
                      <button
                        onClick={() => handleBulkStatus('processed')}
                        className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Processed
                      </button>
                      <button
                        onClick={() => handleBulkStatus('archived')}
                        className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition flex items-center gap-1"
                      >
                        <Archive className="w-3.5 h-3.5" /> Archive
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete All
                      </button>
                    </div>
                  )}
                </div>
              </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enquiries.map((enq) => (
                  <div
                    key={enq._id}
                    className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                      selectedEnquiries.includes(enq._id) ? 'border-[#0055FF] ring-2 ring-[#0055FF]/20' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedEnquiries.includes(enq._id)}
                            onChange={() => handleSelectOne(enq._id)}
                            className="rounded border-gray-300 w-4 h-4 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-[#0055FF]">
                            {enq.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          {enq.status === 'new' && (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                              New
                            </span>
                          )}
                          {enq.status === 'processed' && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                              <Check className="w-3 h-3" /> Processed
                            </span>
                          )}
                          {enq.status === 'archived' && (
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                              <Archive className="w-3 h-3" /> Archived
                            </span>
                          )}
                        </div>
                      </div>
          
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{enq.name}</h3>
                        <p className="text-sm text-gray-600">{enq.jobTitle} · {enq.company}</p>
                      </div>
          
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{enq.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{enq.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span>{enq.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs">{formatDate(enq.createdAt)}</span>
                        </div>
                      </div>
          
                      <p className="text-gray-700 text-sm border-t pt-3 mt-2 italic">
                        "{enq.jobDetails.substring(0, 80)}{enq.jobDetails.length > 80 && '...'}"
                      </p>
          
                      <div className="mt-4 flex flex-wrap gap-2 justify-end">
                        {enq.status !== 'processed' && (
                          <button
                            onClick={() => handleStatusChange(enq._id, 'processed')}
                            className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Process
                          </button>
                        )}
                        {enq.status !== 'archived' && (
                          <button
                            onClick={() => handleStatusChange(enq._id, 'archived')}
                            className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-700 transition flex items-center gap-1"
                          >
                            <Archive className="w-3.5 h-3.5" /> Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEnquiry(enq._id)}
                          className="border border-red-200 text-red-600 px-3 py-1.5 rounded text-xs hover:bg-red-50 transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          
              {enquiries.length === 0 && (
                <div className="text-center text-gray-400 py-12 bg-white rounded-lg border border-gray-200">
                  <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No enquiries found</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'contact-details' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
                <p className="text-sm text-gray-500 mt-1">{enquiries.length} contact submission{enquiries.length !== 1 ? 's' : ''} received</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 mb-6 flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={enquirySearch} onChange={(e) => setEnquirySearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm bg-gray-50" />
                </div>
                <select value={enquiryFilter} onChange={(e) => setEnquiryFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 text-sm bg-gray-50">
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="processed">Processed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enquiries.map((enq) => (
                  <div key={enq._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEnquiry(enq)}>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div><h3 className="text-lg font-bold text-gray-900">{enq.name}</h3><p className="text-sm text-gray-600">{enq.jobTitle} · {enq.company}</p></div>
                        {enq.status === 'new' && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">New</span>}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span>{enq.email}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{enq.phone}</span></div>
                        <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" /><span>{enq.country}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span>{formatDate(enq.createdAt)}</span></div>
                      </div>
                      <p className="text-gray-700 text-sm border-t pt-3 mt-2 italic">"{enq.jobDetails.substring(0, 100)}{enq.jobDetails.length > 100 && '...'}"</p>
                      <div className="mt-4 flex justify-end"><button onClick={(e) => { e.stopPropagation(); setSelectedEnquiry(enq); }} className="text-[#0055FF] text-sm font-medium hover:underline">View Details →</button></div>
                    </div>
                  </div>
                ))}
              </div>
              {enquiries.length === 0 && <div className="text-center text-gray-400 py-12">No contact submissions yet.</div>}
              {selectedEnquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4"><h2 className="text-2xl font-bold text-gray-900">Contact Details</h2><button onClick={() => setSelectedEnquiry(null)}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button></div>
                      <div className="space-y-4">
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Full Name</p><p className="text-gray-900">{selectedEnquiry.name}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Email</p><p className="text-gray-900">{selectedEnquiry.email}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Phone</p><p className="text-gray-900">{selectedEnquiry.phone}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Company</p><p className="text-gray-900">{selectedEnquiry.company}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Country</p><p className="text-gray-900">{selectedEnquiry.country}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Submitted</p><p className="text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Job Title</p><p className="text-gray-900">{selectedEnquiry.jobTitle}</p></div>
                        <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Job / Project Details</p><p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.jobDetails}</p></div>
                      </div>
                      <div className="flex gap-3 mt-6 pt-4 border-t">
                        <button onClick={() => handleReplyEmail(selectedEnquiry.email, selectedEnquiry.name, selectedEnquiry.jobDetails)} className="bg-[#0055FF] text-white px-4 py-2 rounded text-sm flex items-center gap-2"><Send className="w-4 h-4" /> Reply via Email</button>
                        <button onClick={() => setSelectedEnquiry(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Review Moderation</h2>
                <div className="flex gap-4 mt-2 border-b">
                  {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button key={status} onClick={() => setReviewFilter(status)} className={`px-4 py-2 text-sm font-medium transition-colors ${reviewFilter === status ? 'border-b-2 border-[#0055FF] text-[#0055FF]' : 'text-gray-500 hover:text-gray-700'}`}>
                      {status.toUpperCase()} ({reviewCounts[status]})
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-gray-900">{review.name}</h3><span className="text-sm text-gray-500">· {review.company}</span><span className="text-xs text-gray-400 ml-2">{formatDate(review.date)}</span></div>
                        <div className="flex items-center gap-1 my-2">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />)}</div>
                        <p className="text-gray-700 italic">"{review.comment}"</p>
                        <div className="mt-3"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${review.status === 'approved' ? 'bg-green-100 text-green-800' : review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{review.status.toUpperCase()}</span></div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {review.status !== 'approved' && <button onClick={() => handleApproveReview(review._id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-emerald-700"><ThumbsUp className="w-3.5 h-3.5" /> Approve</button>}
                        {review.status !== 'rejected' && <button onClick={() => handleRejectReview(review._id)} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-red-700"><ThumbsDown className="w-3.5 h-3.5" /> Reject</button>}
                        <button onClick={() => handleDeleteReview(review._id)} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-50 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <div className="text-center text-gray-400 py-12">No reviews in this category.</div>}
              </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <p className="text-sm text-gray-500 mt-1">{blogPosts.length} total · {blogPosts.filter(p => p.published).length} published</p>
              </div>

              <div id="blog-form" className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
                <h3 className="text-lg font-bold mb-4">{editingBlog ? 'Edit Post' : 'Create New Post'}</h3>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <input type="text" placeholder="Title *" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} required className="w-full border border-gray-200 rounded px-4 py-2" />
                  <input type="text" placeholder="Excerpt *" value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} required className="w-full border border-gray-200 rounded px-4 py-2" />
                  <textarea placeholder="Content *" rows="6" value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} required className="w-full border border-gray-200 rounded px-4 py-2" />
                  <input type="text" placeholder="Image URL *" value={blogForm.image} onChange={(e) => setBlogForm({...blogForm, image: e.target.value})} required className="w-full border border-gray-200 rounded px-4 py-2" />
                  <input type="text" placeholder="Author" value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2" />
                  <input type="text" placeholder="Tags (comma separated)" value={blogForm.tags.join(', ')} onChange={(e) => setBlogForm({...blogForm, tags: e.target.value.split(',').map(t => t.trim())})} className="w-full border border-gray-200 rounded px-4 py-2" />
                  <label className="flex items-center gap-2"><input type="checkbox" checked={blogForm.published} onChange={(e) => setBlogForm({...blogForm, published: e.target.checked})} /> Published (visible on website)</label>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#0055FF] text-white px-4 py-2 rounded">{editingBlog ? 'Update' : 'Publish'}</button>
                    {editingBlog && <button type="button" onClick={() => { setEditingBlog(null); setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'AI Solutions Team', published: true, tags: [] }); }} className="border border-gray-300 px-4 py-2 rounded">Cancel</button>}
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                {blogPosts.map(post => (
                  <div key={post._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{getBlogCategory(post)}</span>
                          {post.published ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Published</span> : <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Draft</span>}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400"><span>{post.author}</span><span>·</span><span>{formatDate(post.createdAt)}</span></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditBlog(post)} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-gray-50"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDeleteBlog(post._id)} className="border border-red-200 text-red-600 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {blogPosts.length === 0 && <div className="text-center text-gray-400 py-12">No blog posts yet. Create your first post!</div>}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div>
              <div className="bg-white border p-5 mb-6">
                <h2 className="text-xl font-bold mb-4">Add Gallery Item</h2>
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <input type="text" placeholder="Title *" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} required className="w-full border p-2" />
                  <input type="text" placeholder="Image URL *" value={galleryForm.image} onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})} required className="w-full border p-2" />
                  <select value={galleryForm.category} onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border p-2">
                    <option value="event">Event</option><option value="product">Product</option><option value="team">Team</option><option value="workshop">Workshop</option>
                  </select>
                  <input type="text" placeholder="Description" value={galleryForm.description} onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})} className="w-full border p-2" />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2">Add</button>
                </form>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {galleryItems.map((item) => (
                  <div key={item._id} className="border p-2">
                    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                    <p className="font-bold">{item.title}</p>
                    <button onClick={() => handleDeleteGallery(item._id)} className="text-red-600 text-sm">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white border p-6 max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Update Contact Details (Company Info)</h2>
              <form onSubmit={handleContactUpdate} className="space-y-4">
                <input type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} required className="w-full border p-2" />
                <input type="text" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} required className="w-full border p-2" />
                <input type="text" placeholder="Address" value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} required className="w-full border p-2" />
                <input type="text" placeholder="Hours" value={contact.hours} onChange={(e) => setContact({...contact, hours: e.target.value})} required className="w-full border p-2" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2">Save</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;