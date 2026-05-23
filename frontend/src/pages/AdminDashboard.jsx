import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu, X, ChevronDown, Trash2, Eye, LayoutDashboard, Inbox, Star,
  MessageSquare, BookOpen, Plus, Edit3, Check, Ban, Globe, Phone,
  Mail, Calendar, User, Building, LogOut, Image, Search
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

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // --- State ---
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', image: '',
    author: 'AI Solutions Team', published: true,
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
      const params = reviewFilter ? { status: reviewFilter } : {};
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
    if (activeTab === 'enquiries') fetchEnquiries();
    else if (activeTab === 'reviews') fetchReviews();
    else if (activeTab === 'blog') fetchBlogs();
    else if (activeTab === 'gallery') fetchGallery();
    else if (activeTab === 'contact') fetchContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, enquiryFilter, enquirySearch, reviewFilter]);

  // --- Handlers ---
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
  const handleApproveReview = async (id) => {
    try { await approveReview(id); fetchReviews(); }
    catch (err) { alert('Failed to approve review'); }
  };
  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review?')) {
      try { await deleteReview(id); fetchReviews(); }
      catch (err) { alert('Failed to delete review'); }
    }
  };
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
      setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'AI Solutions Team', published: true });
      setEditingBlog(null);
      await fetchBlogs();
    } catch (err) { alert('Failed to save blog post'); }
  };
  const handleEditBlog = (post) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title, excerpt: post.excerpt, content: post.content,
      image: post.image, author: post.author, published: post.published,
    });
  };
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try { await deleteBlogPost(id); await fetchBlogs(); }
      catch (err) { alert('Failed to delete blog'); }
    }
  };
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
  const handleContactUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateContactDetails(contact);
      alert('Contact details updated!');
    } catch (err) { alert('Failed to update contact details'); }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  // Stats
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const publishedPosts = blogPosts.filter(p => p.published).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: Inbox, badge: newEnquiries },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: pendingReviews },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
          <div className="px-5 py-5 border-b border-gray-700">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-[#0055FF] to-indigo-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="0.5" y="0.5" width="5" height="5" fill="white" fillOpacity="0.9" />
                  <rect x="6.5" y="0.5" width="5" height="5" fill="white" fillOpacity="0.4" />
                  <rect x="0.5" y="6.5" width="5" height="5" fill="white" fillOpacity="0.4" />
                  <rect x="6.5" y="6.5" width="5" height="5" fill="white" fillOpacity="0.15" />
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 border border-gray-200 hover:bg-gray-50">
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-bold text-gray-900 capitalize">{activeTab} Management</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0055FF] to-indigo-600 flex items-center justify-center text-xs font-bold text-white">A</div>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Overview Tab */}
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Recent Enquiries */}
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

                {/* Pending Reviews */}
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

          {/* Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    placeholder="Search by name, email or company"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-[#0055FF]"
                  />
                </div>
                <select
                  value={enquiryFilter}
                  onChange={(e) => setEnquiryFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 text-sm bg-gray-50"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="processed">Processed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="bg-white border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{enq.name}</td>
                        <td className="px-4 py-3 text-gray-600">{enq.email}</td>
                        <td className="px-4 py-3 text-gray-600">{enq.company}</td>
                        <td className="px-4 py-3 text-gray-600">{enq.country}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(enq.createdAt)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                            className={`text-xs font-bold px-2 py-1 border rounded-full appearance-none cursor-pointer ${
                              enq.status === 'new' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="processed">Processed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteEnquiry(enq._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr><td colSpan="7" className="p-8 text-center text-gray-400">No enquiries found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 text-sm bg-gray-50"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-white border border-gray-200 p-5">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <p className="font-bold">{rev.name} <span className="text-gray-500 text-sm">from {rev.company}</span></p>
                        <div className="text-yellow-500 my-1">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                        <p className="text-gray-700 mt-2 italic">"{rev.comment}"</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(rev.date)}</p>
                        <p className="text-xs mt-1">
                          Status:{' '}
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            rev.status === 'approved' ? 'bg-green-100 text-green-800' :
                            rev.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {rev.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {rev.status === 'pending' && (
                          <button onClick={() => handleApproveReview(rev._id)} className="bg-emerald-600 text-white px-3 py-1 text-sm rounded hover:bg-emerald-700">
                            Approve
                          </button>
                        )}
                        <button onClick={() => handleDeleteReview(rev._id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews found.</p>}
              </div>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div>
              <div className="bg-white border border-gray-200 p-5 mb-6">
                <h2 className="text-xl font-bold mb-4">{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <input type="text" placeholder="Title *" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} required className="w-full border px-4 py-2" />
                  <input type="text" placeholder="Excerpt *" value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} required className="w-full border px-4 py-2" />
                  <textarea placeholder="Content *" rows="6" value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} required className="w-full border px-4 py-2" />
                  <input type="text" placeholder="Image URL *" value={blogForm.image} onChange={(e) => setBlogForm({...blogForm, image: e.target.value})} required className="w-full border px-4 py-2" />
                  <input type="text" placeholder="Author" value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="w-full border px-4 py-2" />
                  <label className="flex items-center gap-2"><input type="checkbox" checked={blogForm.published} onChange={(e) => setBlogForm({...blogForm, published: e.target.checked})} /> Published (visible on website)</label>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#0055FF] text-white px-5 py-2">{editingBlog ? 'Update' : 'Publish'}</button>
                    {editingBlog && (
                      <button type="button" onClick={() => { setEditingBlog(null); setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'AI Solutions Team', published: true }); }} className="bg-gray-500 text-white px-5 py-2">Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              <h2 className="text-xl font-bold mb-4">Existing Posts</h2>
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post._id} className="bg-white border border-gray-200 p-5 flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      <p className="text-gray-600 text-sm">{post.excerpt}</p>
                      <div className="flex gap-3 text-xs text-gray-400 mt-2">
                        <span>{formatDate(post.createdAt)}</span>
                        <span>By {post.author}</span>
                        <span className={post.published ? 'text-green-600' : 'text-red-600'}>{post.published ? 'Published' : 'Draft'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditBlog(post)} className="bg-yellow-600 text-white px-3 py-1 text-sm rounded">Edit</button>
                      <button onClick={() => handleDeleteBlog(post._id)} className="bg-red-600 text-white px-3 py-1 text-sm rounded">Delete</button>
                    </div>
                  </div>
                ))}
                {blogPosts.length === 0 && <p className="text-center text-gray-400 py-4">No blog posts yet.</p>}
              </div>
            </div>
          )}

          {/* Gallery Tab - UPDATED CATEGORY OPTIONS */}
          {activeTab === 'gallery' && (
            <div>
              <div className="bg-white border border-gray-200 p-5 mb-6">
                <h2 className="text-xl font-bold mb-4">Add New Gallery Image</h2>
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <input type="text" placeholder="Title *" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} required className="w-full border px-4 py-2" />
                  <input type="text" placeholder="Image URL *" value={galleryForm.image} onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})} required className="w-full border px-4 py-2" />
                  <select value={galleryForm.category} onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border px-4 py-2">
                    <option value="event">Event</option>
                    <option value="product">Product</option>
                    <option value="team">Team</option>
                    <option value="workshop">Workshop</option>
                    <option value="expo">Expo</option>
                    <option value="award">Awards</option>
                    <option value="launch">Launch</option>
                    <option value="network">Networking</option>
                  </select>
                  <input type="text" placeholder="Description (optional)" value={galleryForm.description} onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})} className="w-full border px-4 py-2" />
                  <button type="submit" className="bg-[#0055FF] text-white px-5 py-2">Add to Gallery</button>
                </form>
              </div>

              <h2 className="text-xl font-bold mb-4">Gallery Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div key={item._id} className="bg-white border border-gray-200 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                      {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                      <button onClick={() => handleDeleteGallery(item._id)} className="mt-2 text-red-600 text-sm font-medium">Delete</button>
                    </div>
                  </div>
                ))}
                {galleryItems.length === 0 && <p className="text-center text-gray-400 col-span-3 py-8">No gallery items yet.</p>}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="bg-white border border-gray-200 p-6 max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Update Contact Details</h2>
              <form onSubmit={handleContactUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} required className="w-full border px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} required className="w-full border px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} required className="w-full border px-4 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <input type="text" value={contact.hours} onChange={(e) => setContact({...contact, hours: e.target.value})} required className="w-full border px-4 py-2" />
                </div>
                <button type="submit" className="bg-[#0055FF] text-white px-5 py-2">Save Changes</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;