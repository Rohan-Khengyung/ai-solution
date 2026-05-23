# AI Solutions Website - MERN Stack

## Project Overview

AI Solutions is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a modern online presence for an AI software company, showcasing services, past projects, customer testimonials, articles, events, and a photo gallery. The platform allows potential customers to submit job enquiries and write reviews. A secure admin panel enables the business owner to manage all enquiries, approve or delete reviews, create blog posts, manage gallery items, and update contact details. A chatbot widget is available on all public pages for user interaction.

The project was developed as a complete solution from requirements specification to deployment-ready code, with a focus on responsive design, security, and ease of use.

## Technology Stack

### Frontend
- React 18 with Vite (fast build tool)
- React Router DOM for client-side routing
- Tailwind CSS for utility-first responsive styling
- Axios for HTTP requests
- Context API for authentication state management

### Backend
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for admin authentication
- Bcryptjs for password hashing
- Express Validator for input validation
- Helmet.js for security headers
- CORS for cross-origin resource sharing
- Morgan for HTTP logging
- Express Rate Limit for brute-force protection

### Additional Tools
- Nodemon for development auto-restart
- Dotenv for environment variables
- Git for version control

## Project Structure
## Project Structure

```plaintext
ai-solutions-website/
├── backend/
│   ├── config/               # Database and Cloudinary config
│   ├── controllers/          # Business logic for all resources
│   ├── middleware/            # Auth, error handling, validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints (public, admin, upload)
│   ├── utils/                # Admin seeder script
│   ├── uploads/              # Local image storage (gitignored)
│   ├── .env                  # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/       # Reusable UI (Layout, ChatBot, PrivateRoute)
    │   ├── contexts/         # AuthContext for admin state
    │   ├── pages/            # All page components
    │   ├── services/         # API client and endpoints
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── App.css
    │   └── index.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

### Features Implemented

### Public Pages (No Login Required)
- Home page with hero section, statistics, project preview, testimonials preview, events and latest articles.
- Services page detailing AI Virtual Assistant, Prototyping Solutions, Automation Platform with key features.
- Testimonials page showing approved reviews, average rating, and a form for users to submit their own review (pending admin approval).
- Events & Gallery page showing upcoming events (static) and a dynamic photo gallery fetched from backend.
- Blog page listing all published blog posts with pagination.
- Individual blog post page (slug-based URL).
- Contact page with contact details (fetched from database) and a form to submit job enquiries.
- Responsive header and footer with navigation links.

### Admin Panel
- Secure login at `/admin` route.
- Dashboard with tabs: Enquiries, Reviews, Blog, Gallery, Contact.
- Enquiries management: view all submitted enquiries, change status (new/processed/archived), delete enquiries.
- Reviews management: view all reviews (pending/approved), approve pending reviews, delete any review.
- Blog management: create new blog posts (title, excerpt, content, image URL), delete posts (update and list features can be extended).
- Gallery management: add new gallery items (title, image URL, category), delete items.
- Contact details management: update email, phone, address, business hours – displayed instantly on the contact page.

### Additional Features
- Floating chatbot assistant (frontend-only) on the bottom-right corner of all public pages. Predefined responses for common questions (services, pricing, demos). Easily extensible.
- Fully responsive design – works on mobile, tablet, and desktop.
- Input validation on all forms (client-side and server-side).
- JWT authentication for admin routes; all admin API endpoints are protected.
- Password hashing with bcrypt.
- Rate limiting to prevent abuse.
- Security headers via Helmet.
- CORS properly configured for development (can be restricted in production).

## API Endpoints

All API routes are prefixed with `/api`. Public routes are accessible without authentication; admin routes require a Bearer token.

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enquiries` | Submit a new job enquiry |
| GET | `/api/reviews` | Get all approved reviews |
| POST | `/api/reviews` | Submit a new review (status: pending) |
| GET | `/api/blog` | Get published blog posts (paginated) |
| GET | `/api/blog/:slug` | Get single blog post by slug |
| GET | `/api/gallery` | Get all gallery items (optional category query param) |
| GET | `/api/contact` | Get contact details |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login (returns JWT) |
| GET | `/api/admin/me` | Get current admin info |
| GET | `/api/admin/enquiries` | Get all enquiries (filter by status, search) |
| PUT | `/api/admin/enquiries/:id/status` | Update enquiry status |
| DELETE | `/api/admin/enquiries/:id` | Delete enquiry |
| GET | `/api/admin/reviews` | Get all reviews (filter by status) |
| PUT | `/api/admin/reviews/:id/approve` | Approve a review |
| DELETE | `/api/admin/reviews/:id` | Delete review |
| POST | `/api/admin/blog` | Create new blog post |
| PUT | `/api/admin/blog/:id` | Update blog post (optional – not fully implemented in frontend but endpoint exists) |
| DELETE | `/api/admin/blog/:id` | Delete blog post |
| POST | `/api/admin/gallery` | Add gallery item |
| DELETE | `/api/admin/gallery/:id` | Delete gallery item |
| PUT | `/api/admin/contact` | Update contact details |

## Database Schema (Mongoose Models)

### Admin
- email (String, unique, required)
- password (String, required)
- role (String, enum: admin/superadmin)
- lastLogin (Date)
- createdAt (Date)

### Enquiry
- name, email, phone, company, country, jobTitle, jobDetails (all required)
- status (String, enum: new/processed/archived, default: new)
- createdAt (Date)

### Review
- name, company, comment (required)
- rating (Number, 1-5)
- status (String, enum: pending/approved/rejected, default: pending)
- date (Date)

### BlogPost
- title, slug (auto-generated), excerpt, content, image, author (all required)
- published (Boolean, default: true)
- views (Number, default: 0)
- tags (Array of strings)
- createdAt, updatedAt (Date)

### GalleryItem
- title (required)
- image (URL, required)
- category (String, enum: event/product/team/workshop)
- description (optional)
- createdAt (Date)

### ContactDetail
- email, phone, address, hours (all required)
- updatedAt (Date)

## Installation and Setup Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ai-solutions-website
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the **backend** folder with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_solutions
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@aisolutions.com
ADMIN_PASSWORD=Admin123!@#
NODE_ENV=development
```

Start MongoDB (if local), then seed the admin user and start the backend:

```bash
npm run seed
npm run dev
```

The backend will run on `http://localhost:5000`.

### Step 3: Frontend Setup

Open a new terminal in the project root:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

### Step 4: Access the Application

- **Public website:** [http://localhost:3000](http://localhost:3000)
- **Admin login:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default admin credentials:**
  - Email: `admin`
  - Password: `admin123`

### Step 5: (Optional) Production Build

**Frontend:**

```bash
cd frontend
npm run build
```

The build output is in `frontend/dist/`. Serve it with any static server or integrate with the backend.

**Backend production:**  
Set `NODE_ENV=production` in your `.env` and run:

```bash
npm start
```

## Testing Credentials and Data

The seed script creates one admin user for development. You can manually add more data via the admin dashboard after login.  
All API endpoints can be tested with tools like Postman or directly through the frontend forms.

## Security Measures Implemented

- Passwords hashed with bcrypt (salt rounds = 10)
- JWT tokens expire after 7 days
- Admin routes protected with token‑verification middleware
- Environment variables for secrets – never hardcoded
- Input sanitization and validation using `express-validator`
- Rate limiting (100 requests per 15 minutes per IP) on all API routes
- `helmet` sets security headers (XSS protection, no sniff, etc.)
- CORS configured to allow only the frontend origin (restrict to actual domain in production)
- MongoDB connection uses environment variables
- `.gitignore` includes `.env`, `node_modules`, and `uploads/`

## Known Limitations and Future Enhancements

- **File uploads:** implemented locally (multer) but not integrated into frontend forms; admin must manually provide image URLs. *Future: Cloudinary or local image picker.*
- **Chatbot:** frontend‑only, no conversation history persisted. *Future: backend AI service integration.*
- **Events page:** static content. *Future: Event model and admin management.*
- **Blog admin:** create and delete only; editing is partially implemented. *Future: full CRUD.*
- No payment processing or public user accounts (as per requirements).
- Admin lists lack pagination; could be added for large datasets.

## Troubleshooting Common Issues

- **MongoDB connection error:** Ensure MongoDB is running. For Atlas, check network access and credentials.
- **CORS error:** Verify the backend CORS origin matches the frontend URL (default `http://localhost:3000`). In production, update the `cors` middleware.
- **Admin login fails:** Check that the seed script ran correctly. You can manually add an admin using MongoDB Compass or the `mongo` shell (with a bcrypt‑hashed password).
- **Images not showing:** Use publicly accessible image URLs. The mock data uses `picsum.photos`; for real use, upload to a cloud service or serve from the backend `uploads` folder.
- **Form validation errors:** Backend returns detailed error messages; they are displayed on the frontend forms.

## Credits and References

Developed as a full‑stack solution based on client requirements for AI Solutions.  
Built with open‑source libraries and follows MERN stack best practices.  
Design is custom‑built with Tailwind CSS, referencing the provided wireframes.

## License

This project is for demonstration and educational purposes. All rights reserved by the developer.

## Contact

For issues or questions, please refer to the developer documentation or open an issue in the repository.
