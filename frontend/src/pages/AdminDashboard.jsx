import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu, LayoutDashboard, Inbox, Star, BookOpen, Image, Phone,
  Mail, LogOut, Search, Send, Check, X, Globe, Calendar, Plus, Edit, Trash2, ThumbsUp, ThumbsDown, Archive,
  Clock, MapPin, Users, BarChart3, TrendingUp, Filter, Download, Eye, MessageCircle, ChevronRight, ChevronDown, UserPlus
} from 'lucide-react';
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getAllReviews,
  approveReview,
  rejectReview,
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
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getAllRegistrations,
  deleteRegistration,
  getChatHistories,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);

  // Chart time range: 'day', 'month', 'year'
  const [chartRange, setChartRange] = useState('month');

  // --- Data State ---
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [allReviews, setAllReviews] = useState([]);
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

  // Event state
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '', description: '', date: '', time: '', location: '', image: '', capacity: 100, isActive: true
  });
  const [selectedEventRegistrations, setSelectedEventRegistrations] = useState(null);
  const [allRegistrations, setAllRegistrations] = useState([]);

  // Chat History state
  const [chatHistories, setChatHistories] = useState([]);
  const [chatFilterSession, setChatFilterSession] = useState('');
  const [chatSessions, setChatSessions] = useState([]);
  const [chatPage, setChatPage] = useState(1);
  const [chatTotalPages, setChatTotalPages] = useState(1);
  const [expandedSession, setExpandedSession] = useState(null); // Track which session is expanded

  // --- User Management State ---
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '', email: '', password: '', role: 'viewer'
  });
  const [showUserModal, setShowUserModal] = useState(false);

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

  const fetchAllReviews = async () => {
    try {
      const res = await getAllReviews();
      setAllReviews(res.data.data);
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

  const fetchEvents = async () => {
    try {
      const res = await getAllEventsAdmin();
      setEvents(res.data.data);
    } catch (err) { console.error(err); alert('Failed to load events'); }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const res = await getEventRegistrations(eventId);
      setSelectedEventRegistrations({ eventId, registrations: res.data.data });
    } catch (err) { console.error(err); alert('Failed to load registrations'); }
  };

  const fetchAllRegistrations = async () => {
    try {
      const res = await getAllRegistrations();
      setAllRegistrations(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchChatHistories = async () => {
    try {
      const params = {};
      if (chatFilterSession) params.sessionId = chatFilterSession;
      params.page = chatPage;
      const res = await getChatHistories(params);
      setChatHistories(res.data.data);
      setChatSessions(res.data.sessions || []);
      setChatTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
      alert('Failed to load chat histories');
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await getAdminUsers();
      setAdminUsers(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load admin users');
    }
  };

  const handleDeleteRegistration = async (registrationId, eventId, registrantName) => {
    if (window.confirm(`Delete registration for ${registrantName}?`)) {
      try {
        await deleteRegistration(registrationId);
        fetchRegistrations(eventId);
        alert('Registration deleted successfully');
      } catch (err) {
        console.error(err);
        alert('Failed to delete registration');
      }
    }
  };

  // CSV Export
  const exportToCSV = (dataToExport, filename = 'enquiries.csv') => {
    if (!dataToExport.length) {
      alert('No data to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Country', 'Job Title', 'Job Details', 'Status', 'Date'];
    const rows = dataToExport.map(enq => [
      enq.name,
      enq.email,
      enq.phone,
      enq.company,
      enq.country,
      enq.jobTitle,
      enq.jobDetails.replace(/"/g, '""'),
      enq.status,
      new Date(enq.createdAt).toLocaleDateString()
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSelected = () => {
    if (selectedEnquiries.length === 0) {
      alert('No enquiries selected');
      return;
    }
    const selectedData = enquiries.filter(enq => selectedEnquiries.includes(enq._id));
    exportToCSV(selectedData, `selected_enquiries_${new Date().toISOString().slice(0,19)}.csv`);
  };

  const handleExportAll = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export');
      return;
    }
    exportToCSV(enquiries, `all_enquiries_${new Date().toISOString().slice(0,19)}.csv`);
  };

  // --- Initial data load for overview and all tabs ---
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchEnquiries(),
        fetchAllReviews(),
        fetchBlogs(),
        fetchGallery(),
        fetchEvents(),
        fetchContact(),
        fetchAdminUsers(), // load users on mount
      ]);
    };
    loadAllData();
  }, []);

  // Re-fetch enquiries when filter/search changes
  useEffect(() => {
    if (activeTab === 'enquiries' || activeTab === 'overview') {
      fetchEnquiries();
    }
  }, [enquiryFilter, enquirySearch, activeTab]);

  // Fetch chat histories when tab becomes active or filters/page change
  useEffect(() => {
    if (activeTab === 'chat-history') {
      fetchChatHistories();
      // Reset expanded session when changing filter
      setExpandedSession(null);
    }
  }, [activeTab, chatFilterSession, chatPage]);

  // --- Enquiry handlers ---
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
    try { await approveReview(id); await fetchAllReviews(); }
    catch (err) { alert('Failed to approve review'); }
  };
  const handleRejectReview = async (id) => {
    if (!window.confirm('Reject this review?')) return;
    try { await rejectReview(id); await fetchAllReviews(); alert('Review rejected'); }
    catch (err) { console.error(err); alert('Failed to reject review'); }
  };
  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review permanently?')) {
      try { await deleteReview(id); await fetchAllReviews(); }
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

  // --- Event handlers ---
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) await updateEvent(editingEvent._id, eventForm);
      else await createEvent(eventForm);
      alert(editingEvent ? 'Event updated' : 'Event created');
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: '', time: '', location: '', image: '', capacity: 100, isActive: true });
      fetchEvents();
    } catch (err) { alert('Failed to save event'); }
  };
  const handleDeleteEvent = async (id) => {
    if (window.confirm('Delete event?')) {
      await deleteEvent(id);
      fetchEvents();
    }
  };

  // Reply via email
  const handleReplyEmail = (email, name, jobDetails) => {
    const subject = `Reply to your enquiry - AI Solutions`;
    const body = `Dear ${name},\n\nThank you for your enquiry. We will get back to you shortly.\n\nYour enquiry details:\n${jobDetails}\n\nBest regards,\nAI Solutions Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // --- User Management Handlers ---
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // For edit, we may send password only if provided
        const payload = { ...userForm };
        if (!payload.password) delete payload.password; // don't send empty password
        await updateAdminUser(editingUser._id, payload);
        alert('User updated successfully');
      } else {
        const res = await createAdminUser(userForm);
        // Send credentials via email using mailto
        const email = res.data.data.email;
        const username = res.data.data.username;
        const password = userForm.password;
        const subject = 'Your AI Solutions Admin Account';
        const body = `Hello ${username},\n\nAn admin account has been created for you at AI Solutions.\n\nUsername: ${username}\nPassword: ${password}\n\nPlease login at: ${window.location.origin}/admin\n\nYou can change your password after login.\n\nBest regards,\nAI Solutions Team`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        alert('User created. Email client opened to send credentials.');
      }
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ username: '', email: '', password: '', role: 'viewer' });
      fetchAdminUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      password: '', // blank for edit
      role: user.role,
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this admin user? This action cannot be undone.')) {
      try {
        await deleteAdminUser(id);
        alert('User deleted');
        fetchAdminUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // --- Chart data aggregation ---
  const getChartData = () => {
    if (!enquiries.length) return [];

    const now = new Date();
    let groups = new Map();

    if (chartRange === 'day') {
      const days = 14;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toISOString().split('T')[0];
        groups.set(key, 0);
      }
      enquiries.forEach(enq => {
        const date = new Date(enq.createdAt);
        const key = date.toISOString().split('T')[0];
        if (groups.has(key)) groups.set(key, groups.get(key) + 1);
        else if (date >= new Date(now.getTime() - (days-1)*24*60*60*1000)) {
          groups.set(key, (groups.get(key) || 0) + 1);
        }
      });
      return Array.from(groups.entries())
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ label: date.slice(5), fullDate: date, count }));
    } 
    else if (chartRange === 'month') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        groups.set(key, 0);
      }
      enquiries.forEach(enq => {
        const date = new Date(enq.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
        if (groups.has(key)) groups.set(key, groups.get(key) + 1);
      });
      return Array.from(groups.entries())
        .sort((a,b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => {
          const [year, mon] = month.split('-');
          const monthName = new Date(parseInt(year), parseInt(mon)-1).toLocaleString('default', { month: 'short' });
          return { label: `${monthName} ${year}`, count };
        });
    } 
    else {
      const yearsSet = new Set();
      enquiries.forEach(enq => {
        const year = new Date(enq.createdAt).getFullYear();
        yearsSet.add(year);
      });
      const currentYear = now.getFullYear();
      if (!yearsSet.has(currentYear)) yearsSet.add(currentYear);
      const years = Array.from(yearsSet).sort();
      years.forEach(year => groups.set(year, 0));
      enquiries.forEach(enq => {
        const year = new Date(enq.createdAt).getFullYear();
        groups.set(year, groups.get(year) + 1);
      });
      return Array.from(groups.entries())
        .sort((a,b) => a[0] - b[0])
        .map(([year, count]) => ({ label: year.toString(), count }));
    }
  };

  const chartData = getChartData();
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold">Enquiries:</span> {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const publishedPosts = blogPosts.filter(p => p.published).length;

  const reviewCounts = {
    all: allReviews.length,
    pending: allReviews.filter(r => r.status === 'pending').length,
    approved: allReviews.filter(r => r.status === 'approved').length,
    rejected: allReviews.filter(r => r.status === 'rejected').length
  };

  const filteredReviews = allReviews.filter(review => {
    if (reviewFilter === 'all') return true;
    return review.status === reviewFilter;
  });

  // Navigation items – added 'users' after chat-history
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: Inbox, badge: newEnquiries },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: reviewCounts.pending },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'chat-history', label: 'Chat History', icon: MessageCircle },
    { id: 'users', label: 'Users', icon: Users },   // <-- New User Management
    { id: 'contact', label: 'Contact Info', icon: Phone },
  ];

  const getBlogCategory = (post) => (post.tags && post.tags[0]) || 'Article';
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();

  // Group chat histories by session
  const groupBySession = (histories) => {
    const grouped = new Map();
    histories.forEach(chat => {
      if (!grouped.has(chat.sessionId)) {
        grouped.set(chat.sessionId, []);
      }
      grouped.get(chat.sessionId).push(chat);
    });
    return grouped;
  };

  const groupedChats = groupBySession(chatHistories);

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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 border border-gray-200 hover:bg-gray-50">
              <Menu className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-bold text-gray-900 capitalize">
              {activeTab} Management
            </span>
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
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">{reviewCounts.pending}</div>
                  <p className="text-xs text-gray-400 mt-1">{reviewCounts.approved} approved</p>
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

              {/* Analytics Chart */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#0055FF]" />
                      Enquiries Analytics
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Track enquiries over time</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    {['day', 'month', 'year'].map(range => (
                      <button
                        key={range}
                        onClick={() => setChartRange(range)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                          chartRange === range
                            ? 'bg-[#0055FF] text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0055FF" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={() => <span className="text-sm text-gray-600">Number of Enquiries</span>} />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill="url(#barGradient)" />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {chartData.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No enquiry data available to display chart.</p>
                    <p className="text-xs mt-1">Submit enquiries to see analytics.</p>
                  </div>
                )}
              </div>

              {/* Recent Enquiries & Pending Reviews */}
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
                    {allReviews.filter(r => r.status === 'pending').slice(0, 4).map((r) => (
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
                    {allReviews.filter(r => r.status === 'pending').length === 0 && <div className="px-5 py-8 text-center text-xs text-gray-400">No pending reviews</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enquiries Management</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {enquiries.length} total enquiries · {enquiries.filter(e => e.status === 'new').length} new · {enquiries.filter(e => e.status === 'processed').length} processed
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleExportSelected} disabled={selectedEnquiries.length === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${selectedEnquiries.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    <Download className="w-4 h-4" /> Export Selected
                  </button>
                  <button onClick={handleExportAll} disabled={enquiries.length === 0} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${enquiries.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    <Download className="w-4 h-4" /> Export All
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex-1 min-w-[200px] relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input value={enquirySearch} onChange={(e) => setEnquirySearch(e.target.value)} placeholder="Search by name, email or company..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#0055FF] focus:ring-1 focus:ring-[#0055FF]" />
                    </div>
                    <select value={enquiryFilter} onChange={(e) => setEnquiryFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#0055FF]">
                      <option value="">All Statuses</option>
                      <option value="new">New</option>
                      <option value="processed">Processed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  {selectedEnquiries.length > 0 && (
                    <div className="flex gap-2 items-center bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">{selectedEnquiries.length} selected</span>
                      <button onClick={() => handleBulkStatus('processed')} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Mark Processed</button>
                      <button onClick={() => handleBulkStatus('archived')} className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition flex items-center gap-1"><Archive className="w-3.5 h-3.5" /> Archive</button>
                      <button onClick={handleBulkDelete} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete All</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-10 px-4 py-3"><input type="checkbox" checked={selectedEnquiries.length === enquiries.length && enquiries.length > 0} onChange={(e) => { if (e.target.checked) setSelectedEnquiries(enquiries.map(e => e._id)); else setSelectedEnquiries([]); }} className="rounded border-gray-300 w-4 h-4" /></th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Name</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Email</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Company</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Country</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Date</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Status</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Job Title</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {enquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedEnquiry(enq)}>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedEnquiries.includes(enq._id)} onChange={() => handleSelectOne(enq._id)} className="rounded border-gray-300 w-4 h-4" /></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{enq.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{enq.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{enq.company}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{enq.country}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(enq.createdAt)}</td>
                        <td className="px-4 py-3">
                          {enq.status === 'new' && <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>New</span>}
                          {enq.status === 'processed' && <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Processed</span>}
                          {enq.status === 'archived' && <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full"><Archive className="w-3 h-3" /> Archived</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{enq.jobTitle}</td>
                        <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedEnquiry(enq)} className="text-gray-500 hover:text-blue-600 transition" title="View Details"><Eye className="w-4 h-4" /></button>
                            {enq.status !== 'processed' && <button onClick={() => handleStatusChange(enq._id, 'processed')} className="text-green-600 hover:text-green-800 transition" title="Mark Processed"><Check className="w-4 h-4" /></button>}
                            {enq.status !== 'archived' && <button onClick={() => handleStatusChange(enq._id, 'archived')} className="text-gray-600 hover:text-gray-800 transition" title="Archive"><Archive className="w-4 h-4" /></button>}
                            <button onClick={() => handleDeleteEnquiry(enq._id)} className="text-red-600 hover:text-red-800 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            <button onClick={() => handleReplyEmail(enq.email, enq.name, enq.jobDetails)} className="text-blue-600 hover:text-blue-800 transition" title="Reply via Email"><Send className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {enquiries.length === 0 && <div className="text-center text-gray-400 py-12"><Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No enquiries found</p></div>}
              </div>
            </div>
          )}

          {/* Full-screen Enquiry Detail Modal */}
          {selectedEnquiry && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Enquiry Details</h2>
                  <button onClick={() => setSelectedEnquiry(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Full Name</p><p className="text-gray-900 font-medium">{selectedEnquiry.name}</p></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Job Title</p><p className="text-gray-900">{selectedEnquiry.jobTitle}</p></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Email</p><p className="text-gray-900 break-all">{selectedEnquiry.email}</p></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Phone</p><p className="text-gray-900">{selectedEnquiry.phone}</p></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Company</p><p className="text-gray-900">{selectedEnquiry.company}</p></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Country</p><p className="text-gray-900">{selectedEnquiry.country}</p></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Status</p><span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${selectedEnquiry.status === 'new' ? 'bg-blue-100 text-blue-700' : selectedEnquiry.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{selectedEnquiry.status.toUpperCase()}</span></div>
                    <div><p className="text-xs font-bold uppercase text-gray-500 mb-1">Submitted On</p><p className="text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p></div>
                  </div>
                  <div><p className="text-xs font-bold uppercase text-gray-500 mb-2">Job / Project Details</p><div className="bg-gray-50 p-4 rounded-lg border border-gray-200"><p className="text-gray-800 whitespace-pre-wrap">{selectedEnquiry.jobDetails}</p></div></div>
                </div>
                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => handleReplyEmail(selectedEnquiry.email, selectedEnquiry.name, selectedEnquiry.jobDetails)} className="bg-[#0055FF] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Send className="w-4 h-4" /> Reply via Email</button>
                  <button onClick={() => setSelectedEnquiry(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
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
                {filteredReviews.map(review => (
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
                {filteredReviews.length === 0 && <div className="text-center text-gray-400 py-12">No reviews in this category.</div>}
              </div>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div>
              <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">Blog Management</h2><p className="text-sm text-gray-500 mt-1">{blogPosts.length} total · {blogPosts.filter(p => p.published).length} published</p></div>
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
                  <div className="flex gap-2"><button type="submit" className="bg-[#0055FF] text-white px-4 py-2 rounded">{editingBlog ? 'Update' : 'Publish'}</button>{editingBlog && <button type="button" onClick={() => { setEditingBlog(null); setBlogForm({ title: '', excerpt: '', content: '', image: '', author: 'AI Solutions Team', published: true, tags: [] }); }} className="border border-gray-300 px-4 py-2 rounded">Cancel</button>}</div>
                </form>
              </div>
              <div className="space-y-4">
                {blogPosts.map(post => (
                  <div key={post._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex-1"><div className="flex items-center gap-2 flex-wrap mb-2"><span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{getBlogCategory(post)}</span>{post.published ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Published</span> : <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Draft</span>}</div><h3 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h3><p className="text-gray-600 text-sm mb-3">{post.excerpt}</p><div className="flex items-center gap-3 text-xs text-gray-400"><span>{post.author}</span><span>·</span><span>{formatDate(post.createdAt)}</span></div></div>
                      <div className="flex gap-2"><button onClick={() => handleEditBlog(post)} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-gray-50"><Edit className="w-3.5 h-3.5" /> Edit</button><button onClick={() => handleDeleteBlog(post._id)} className="border border-red-200 text-red-600 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button></div>
                    </div>
                  </div>
                ))}
                {blogPosts.length === 0 && <div className="text-center text-gray-400 py-12">No blog posts yet. Create your first post!</div>}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="mb-6 flex justify-between items-center"><div><h2 className="text-2xl font-bold text-gray-900">Event Management</h2><p className="text-sm text-gray-500 mt-1">{events.length} total events</p></div></div>
              <div id="event-form" className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
                <h3 className="text-lg font-bold mb-4">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <input type="text" placeholder="Title *" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} required className="w-full border rounded p-2" />
                  <textarea placeholder="Description *" rows="3" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} required className="w-full border rounded p-2" />
                  <div className="grid grid-cols-2 gap-4"><input type="date" value={eventForm.date.split('T')[0]} onChange={e => setEventForm({...eventForm, date: e.target.value})} required className="border rounded p-2" /><input type="text" placeholder="Time (e.g., 10:00 – 18:00 BST)" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} required className="border rounded p-2" /></div>
                  <input type="text" placeholder="Location *" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} required className="w-full border rounded p-2" />
                  <input type="text" placeholder="Image URL" value={eventForm.image} onChange={e => setEventForm({...eventForm, image: e.target.value})} className="w-full border rounded p-2" />
                  <input type="number" placeholder="Capacity *" min="1" value={eventForm.capacity} onChange={e => setEventForm({...eventForm, capacity: parseInt(e.target.value)})} required className="w-full border rounded p-2" />
                  <label className="flex items-center gap-2"><input type="checkbox" checked={eventForm.isActive} onChange={e => setEventForm({...eventForm, isActive: e.target.checked})} /> Active (visible on website)</label>
                  <div className="flex gap-2"><button type="submit" className="bg-[#0055FF] text-white px-4 py-2 rounded">{editingEvent ? 'Update' : 'Create'}</button>{editingEvent && <button type="button" onClick={() => { setEditingEvent(null); setEventForm({ title: '', description: '', date: '', time: '', location: '', image: '', capacity: 100, isActive: true }); }} className="border px-4 py-2 rounded">Cancel</button>}</div>
                </form>
              </div>
              <div className="space-y-6">
                {events.map(event => (
                  <div key={event._id} className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1"><h3 className="text-xl font-bold text-gray-900">{event.title}</h3><p className="text-gray-600 text-sm mt-1">{event.description}</p><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm text-gray-500"><span className="flex items-center gap-1"><Calendar size={14} />{new Date(event.date).toLocaleDateString()}</span><span className="flex items-center gap-1"><Clock size={14} />{event.time}</span><span className="flex items-center gap-1"><MapPin size={14} />{event.location}</span><span className="flex items-center gap-1"><Users size={14} />{event.registrations}/{event.capacity}</span></div></div>
                      <div className="flex gap-2"><button onClick={() => { setEditingEvent(event); setEventForm({ ...event, date: event.date.split('T')[0] }); }} className="border border-gray-300 px-3 py-1 rounded text-sm">Edit</button><button onClick={() => handleDeleteEvent(event._id)} className="border border-red-200 text-red-600 px-3 py-1 rounded text-sm">Delete</button><button onClick={() => fetchRegistrations(event._id)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">View Registrations</button></div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedEventRegistrations && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"><div className="p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Registrations</h3><button onClick={() => setSelectedEventRegistrations(null)}><X size={20} /></button></div><table className="w-full text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Name</th><th>Email</th><th>Phone</th><th>Date</th><th>Action</th></tr></thead><tbody>{selectedEventRegistrations.registrations.map(reg => (<tr key={reg._id} className="border-t"><td className="p-2">{reg.name}</td><td className="p-2">{reg.email}</td><td className="p-2">{reg.phone}</td><td className="p-2">{new Date(reg.createdAt).toLocaleDateString()}</td><td className="p-2"><button onClick={() => handleDeleteRegistration(reg._id, selectedEventRegistrations.eventId, reg.name)} className="text-red-600 hover:text-red-800 transition"><Trash2 size={16} /></button></td></tr>))}</tbody></table></div></div>
                </div>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div>
              <div className="bg-white border p-5 mb-6"><h2 className="text-xl font-bold mb-4">Add Gallery Item</h2><form onSubmit={handleGallerySubmit} className="space-y-4"><input type="text" placeholder="Title *" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} required className="w-full border p-2" /><input type="text" placeholder="Image URL *" value={galleryForm.image} onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})} required className="w-full border p-2" /><select value={galleryForm.category} onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})} className="w-full border p-2"><option value="event">Event</option><option value="product">Product</option><option value="team">Team</option><option value="workshop">Workshop</option></select><input type="text" placeholder="Description" value={galleryForm.description} onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})} className="w-full border p-2" /><button type="submit" className="bg-blue-600 text-white px-4 py-2">Add</button></form></div>
              <div className="grid grid-cols-3 gap-4">{galleryItems.map((item) => (<div key={item._id} className="border p-2"><img src={item.image} alt={item.title} className="w-full h-32 object-cover" /><p className="font-bold">{item.title}</p><button onClick={() => handleDeleteGallery(item._id)} className="text-red-600 text-sm">Delete</button></div>))}</div>
            </div>
          )}

          {/* Chat History Tab */}
          {activeTab === 'chat-history' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chat Conversation History</h2>
                <p className="text-sm text-gray-500 mt-1">All user interactions with the AI assistant grouped by session</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Filter by Session</label>
                  <select
                    value={chatFilterSession}
                    onChange={(e) => setChatFilterSession(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
                  >
                    <option value="">All Sessions ({groupedChats.size} sessions)</option>
                    {chatSessions.map(session => {
                      const messageCount = groupedChats.get(session)?.length || 0;
                      const lastMessage = groupedChats.get(session)?.[0]?.timestamp;
                      return (
                        <option key={session} value={session}>
                          {session.substring(0, 20)}... ({messageCount} messages)
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button
                  onClick={() => setChatFilterSession('')}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filter
                </button>
              </div>

              <div className="space-y-4">
                {Array.from(groupedChats.entries()).map(([sessionId, messages]) => (
                  <div key={sessionId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedSession(expandedSession === sessionId ? null : sessionId)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        {expandedSession === sessionId ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                        <MessageCircle className="w-5 h-5 text-[#0055FF]" />
                        <div className="text-left">
                          <p className="text-sm font-mono text-gray-700">{sessionId}</p>
                          <p className="text-xs text-gray-400">
                            {messages.length} messages · Last: {formatDateTime(messages[messages.length - 1]?.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(messages[0]?.timestamp).toLocaleDateString()}
                      </div>
                    </button>

                    {expandedSession === sessionId && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-2">Time</th>
                              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-2">User Message</th>
                              <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-2">Bot Response</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {messages.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)).map((chat, idx) => (
                              <tr key={chat._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                  {formatDateTime(chat.timestamp)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800 max-w-md">
                                  <div className="bg-blue-50 p-2 rounded">
                                    {chat.userMessage}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800 max-w-md">
                                  <div className="bg-gray-50 p-2 rounded">
                                    {chat.botResponse}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
                {groupedChats.size === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No chat history found.</p>
                  </div>
                )}
              </div>

              {chatTotalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => setChatPage(p => Math.max(1, p - 1))}
                    disabled={chatPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1">Page {chatPage} of {chatTotalPages}</span>
                  <button
                    onClick={() => setChatPage(p => Math.min(chatTotalPages, p + 1))}
                    disabled={chatPage === chatTotalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --- USER MANAGEMENT TAB (NEW) --- */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage admin accounts and permissions</p>
                </div>
                <button
                  onClick={() => { setEditingUser(null); setUserForm({ username: '', email: '', password: '', role: 'viewer' }); setShowUserModal(true); }}
                  className="flex items-center gap-2 bg-[#0055FF] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <UserPlus className="w-4 h-4" /> Add New User
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">ID</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Username</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Email</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Role</th>
                      <th className="text-left text-xs font-bold uppercase text-gray-500 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {adminUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-500">#{user._id.slice(-6)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                            user.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                            user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                            user.role === 'manager' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800 transition" title="Edit"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {adminUsers.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No admin users found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="bg-white border p-6 max-w-2xl"><h2 className="text-xl font-bold mb-4">Update Contact Details (Company Info)</h2><form onSubmit={handleContactUpdate} className="space-y-4"><input type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} required className="w-full border p-2" /><input type="text" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} required className="w-full border p-2" /><input type="text" placeholder="Address" value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} required className="w-full border p-2" /><input type="text" placeholder="Hours" value={contact.hours} onChange={(e) => setContact({...contact, hours: e.target.value})} required className="w-full border p-2" /><button type="submit" className="bg-blue-600 text-white px-4 py-2">Save</button></form></div>
          )}
        </main>
      </div>

      {/* User Modal (Add/Edit) */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Username *</label>
                <input type="text" required value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email *</label>
                <input type="email" required value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                <input type="password" required={!editingUser} value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Role</label>
                <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} className="w-full border p-2 rounded">
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-[#0055FF] text-white px-4 py-2 rounded hover:bg-blue-700">{editingUser ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;