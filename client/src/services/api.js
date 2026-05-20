import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

// Mock data service for frontend development
// Replace with actual API calls when backend is ready
export const mockAPI = {
  // Enquiries
  getEnquiries: () => Promise.resolve(mockEnquiries),
  createEnquiry: (data) => Promise.resolve({ ...data, _id: Date.now(), status: 'new' }),
  updateEnquiryStatus: (id, status) => Promise.resolve({ id, status }),
  deleteEnquiry: (id) => Promise.resolve({ id }),

  // Reviews
  getReviews: () => Promise.resolve(mockReviews),
  createReview: (data) => Promise.resolve({ ...data, _id: Date.now(), status: 'pending' }),
  approveReview: (id) => Promise.resolve({ id, status: 'approved' }),
  deleteReview: (id) => Promise.resolve({ id }),

  // Blog Posts
  getBlogPosts: () => Promise.resolve(mockBlogPosts),
  createBlogPost: (data) => Promise.resolve({ ...data, _id: Date.now(), date: new Date().toISOString() }),
  updateBlogPost: (id, data) => Promise.resolve({ id, ...data }),
  deleteBlogPost: (id) => Promise.resolve({ id }),

  // Gallery
  getGalleryItems: () => Promise.resolve(mockGallery),
  createGalleryItem: (data) => Promise.resolve({ ...data, _id: Date.now() }),
  deleteGalleryItem: (id) => Promise.resolve({ id }),

  // Contact Details
  getContactDetails: () => Promise.resolve(mockContactDetails),
  updateContactDetails: (data) => Promise.resolve(data),
}

// Mock Data
const mockEnquiries = [
  { _id: '1', name: 'John Smith', email: 'john@example.com', phone: '+1 555 000 0000', company: 'Tech Corp', country: 'United States', jobTitle: 'CTO', jobDetails: 'Need AI integration', date: '2026-05-10', status: 'new' },
  { _id: '2', name: 'Sarah Johnson', email: 'sarah@healthcare.com', phone: '+44 20 7946 0000', company: 'Healthcare Plus', country: 'United Kingdom', jobTitle: 'Product Manager', jobDetails: 'Automation solution required', date: '2026-05-12', status: 'processed' },
]

const mockReviews = [
  { _id: '1', name: 'Michael Chen', company: 'InnovateTech', rating: 5, comment: 'Outstanding AI solutions! Boosted our efficiency by 200%', date: '2026-04-15', status: 'approved' },
  { _id: '2', name: 'Emma Rodriguez', company: 'Global Finance', rating: 4, comment: 'Great platform, very responsive support team', date: '2026-04-20', status: 'approved' },
  { _id: '3', name: 'David Kim', company: 'StartupHub', rating: 5, comment: 'The automation tools saved us countless hours', date: '2026-05-01', status: 'pending' },
]

const mockBlogPosts = [
  { _id: '1', title: 'The Future of AI in Enterprise', excerpt: 'Discover how AI is transforming business operations...', content: 'Full content here...', image: 'https://picsum.photos/800/400?random=1', date: '2026-05-01', author: 'AI Solutions Team' },
  { _id: '2', title: '5 Ways to Automate Your Workflow', excerpt: 'Increase productivity with these automation tips...', content: 'Full content here...', image: 'https://picsum.photos/800/400?random=2', date: '2026-04-25', author: 'AI Solutions Team' },
]

const mockGallery = [
  { _id: '1', title: 'AI Summit 2026', image: 'https://picsum.photos/400/300?random=10', category: 'event' },
  { _id: '2', title: 'Product Launch', image: 'https://picsum.photos/400/300?random=11', category: 'product' },
  { _id: '3', title: 'Team Workshop', image: 'https://picsum.photos/400/300?random=12', category: 'team' },
]

const mockContactDetails = {
  email: 'hello@aisolutions.com',
  phone: '+1 (800) 555-0199',
  address: '100 Market St, San Francisco, CA',
  hours: 'Mon-Fri, 9am–6pm PST'
}

export default API