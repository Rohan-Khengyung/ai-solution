import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== PUBLIC ENDPOINTS ==========
export const submitEnquiry = (data) => API.post('/enquiries', data);
export const getApprovedReviews = () => API.get('/reviews');
export const submitReview = (data) => API.post('/reviews', data);

// Updated: getBlogPosts accepts params object with page, limit, category
export const getBlogPosts = (params = {}) => {
  const { page = 1, limit = 6, category } = params;
  let query = `page=${page}&limit=${limit}`;
  if (category && category !== 'all') {
    query += `&category=${category}`;
  }
  return API.get(`/blog?${query}`);
};

export const getBlogPostBySlug = (slug) => API.get(`/blog/${slug}`);
export const getGalleryItems = () => API.get('/gallery');
export const getContactDetails = () => API.get('/contact');

// Event endpoints (public)
export const getEvents = () => API.get('/events');
export const registerForEventAPI = (data) => API.post('/events/register', data);

// ========== ADMIN ENDPOINTS ==========
export const adminLogin = (credentials) => API.post('/admin/login', credentials);
export const getEnquiries = (params) => API.get('/admin/enquiries', { params });
export const updateEnquiryStatus = (id, status) => API.put(`/admin/enquiries/${id}/status`, { status });
export const deleteEnquiry = (id) => API.delete(`/admin/enquiries/${id}`);

export const getAllReviews = (status) => API.get('/admin/reviews', { params: { status } });
export const approveReview = (id) => API.put(`/admin/reviews/${id}/approve`);
export const deleteReview = (id) => API.delete(`/admin/reviews/${id}`);
export const rejectReview = (id) => API.put(`/admin/reviews/${id}/reject`);

export const createBlogPost = (data) => API.post('/admin/blog', data);
export const updateBlogPost = (id, data) => API.put(`/admin/blog/${id}`, data);
export const deleteBlogPost = (id) => API.delete(`/admin/blog/${id}`);
export const getAllBlogsAdmin = () => API.get('/admin/blog');

export const addGalleryItem = (data) => API.post('/admin/gallery', data);
export const deleteGalleryItem = (id) => API.delete(`/admin/gallery/${id}`);

export const updateContactDetails = (data) => API.put('/admin/contact', data);

// Event management (admin)
export const getAllEventsAdmin = () => API.get('/admin/events');
export const createEvent = (data) => API.post('/admin/events', data);
export const updateEvent = (id, data) => API.put(`/admin/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/admin/events/${id}`);
export const getEventRegistrations = (eventId) => API.get(`/admin/events/${eventId}/registrations`);
export const getAllRegistrations = () => API.get('/admin/registrations');

// Delete a registration (admin)
export const deleteRegistration = (id) => API.delete(`/admin/registrations/${id}`);

// CHAT 
export const sendChatMessage = (data) => API.post('/chat/store', data);
export const getChatHistory = (sessionId) => API.get(`/chat/${sessionId}`);

// Admin chat management
export const getAllChatSessions = () => API.get('/admin/chat-sessions');
export const getSessionMessages = (sessionId) => API.get(`/admin/chat-sessions/${sessionId}/messages`);
export const deleteSession = (sessionId) => API.delete(`/admin/chat-sessions/${sessionId}`);
export const deleteChatMessage = (id) => API.delete(`/admin/chat-messages/${id}`);
// Admin Users
export const getAdminUsers = () => API.get('/admin/users');
export const createAdminUser = (data) => API.post('/admin/users', data);
export const updateAdminUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);

// EMAIL 
export const sendCustomEmail = (data) => API.post('/admin/send-email', data);

// SERVICES 
export const getActiveServices = () => API.get('/services');
export const getAllServices = () => API.get('/admin/services');
export const createService = (data) => API.post('/admin/services', data);
export const updateService = (id, data) => API.put(`/admin/services/${id}`, data);
export const deleteService = (id) => API.delete(`/admin/services/${id}`);

// TRAININGS 
export const getActiveTrainings = () => API.get('/trainings');
export const getAllTrainings = () => API.get('/admin/trainings');
export const createTraining = (data) => API.post('/admin/trainings', data);
export const updateTraining = (id, data) => API.put(`/admin/trainings/${id}`, data);
export const deleteTraining = (id) => API.delete(`/admin/trainings/${id}`);

// INDUSTRIES 
export const getActiveIndustries = () => API.get('/industries');
export const getAllIndustries = () => API.get('/admin/industries');
export const createIndustry = (data) => API.post('/admin/industries', data);
export const updateIndustry = (id, data) => API.put(`/admin/industries/${id}`, data);
export const deleteIndustry = (id) => API.delete(`/admin/industries/${id}`);

// Image upload 
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('adminToken');
  return API.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

export default API;