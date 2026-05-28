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
export const getBlogPosts = (page = 1) => API.get(`/blog?page=${page}&limit=6`);
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

export default API;