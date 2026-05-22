import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Clock, User, Tag } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { getApprovedReviews, getBlogPosts } from '../services/api';

// --- 3D Animated Cube Component ---
const AnimatedShape = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  // Generate 40 particles evenly distributed on a sphere of radius 1.9
  const particles = [];
  for (let i = 0; i < 40; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.9;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    particles.push([x, y, z]);
  }

  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial color="#0055FF" emissive="#0022AA" roughness={0.3} metalness={0.7} />
        </mesh>
      </Float>
      {particles.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#88AAFF" emissive="#2266FF" />
        </mesh>
      ))}
    </group>
  );
};
// --- 3D Scene Component ---
const Hero3DIllustration = () => {
  return (
    <div className="w-full h-[400px] rounded-sm overflow-hidden relative border border-gray-300 shadow-sm translate-y-[5px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#2266FF" />
        <AnimatedShape />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        <MeshReflectorMaterial />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 pointer-events-none" />
    </div>
  );
};

// Helper component for project images (actual images)
const ProjectImage = ({ title, index }) => {
  // Use high-quality placeholder images (replace with your own URLs)
  const images = {
    'Healthcare AI Integration': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    'Finance Automation': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
    'Retail Customer Experience': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
  };
  const imageUrl = images[title] || `https://picsum.photos/600/400?random=${index}`;

  return (
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
};

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const solutions = [
    { number: '01', title: 'AI Virtual Assistant', description: 'Intelligent conversational AI to enhance customer experience and automate support tasks 24/7.' },
    { number: '02', title: 'Prototyping Solutions', description: 'Rapid AI-powered design and development tools to accelerate your product iteration cycle.' },
    { number: '03', title: 'Automation Platform', description: 'End-to-end workflow automation to streamline business processes and increase efficiency.' },
  ];

  const stats = [
    { value: '70%', label: 'Faster Response Times' },
    { value: '500+', label: 'Clients Worldwide' },
    { value: '3×', label: 'Faster Prototyping' },
    { value: '60%', label: 'Process Automation' },
  ];

  const projects = [
    { title: 'Healthcare AI Integration', year: '2025', tag: 'Healthcare' },
    { title: 'Finance Automation', year: '2025', tag: 'Finance' },
    { title: 'Retail Customer Experience', year: '2024', tag: 'Retail' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, blogsRes] = await Promise.all([getApprovedReviews(), getBlogPosts(1)]);
        setReviews(reviewsRes.data.data.slice(0, 2));
        const formattedBlogs = blogsRes.data.data.map(post => ({
          id: post._id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          author: post.author,
          datePublished: new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          tag: post.tags?.[0] || 'Insights',
        }));
        setBlogs(formattedBlogs.slice(0, 2));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const TAG_COLORS = {
    Insights: 'bg-blue-100 text-blue-700',
    Engineering: 'bg-violet-100 text-violet-700',
    'Case Study': 'bg-emerald-100 text-emerald-700',
    Product: 'bg-amber-100 text-amber-700',
    News: 'bg-rose-100 text-rose-700',
    Default: 'bg-gray-100 text-gray-600',
  };

  return (
    <>
      {/* Hero Section with 3D Illustration */}
      <section className="relative border-b border-gray-200 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #111827 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative max-w-7xl mx-auto px-8 py-28">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-[#0055FF] border border-[#0055FF] px-3 py-1 mb-6">
                AI-Powered Platform
              </span>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                AI Solutions for Digital Employee Experience
              </h1>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Speeding up design, engineering, and innovation with cutting-edge artificial intelligence.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-[#0055FF] text-white px-7 py-3.5 text-sm font-bold tracking-wide hover:bg-[#0044CC] transition-colors duration-150">
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-7 py-3.5 hover:border-gray-500 transition-colors duration-150">
                  View Services
                </Link>
              </div>
            </div>
            <div className="relative">
              <Hero3DIllustration />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-[#0055FF] opacity-30" />
              <div className="absolute -top-4 -right-4 w-16 h-16 border border-gray-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            {stats.map((stat, i) => (
              <div key={i} className="px-8 first:pl-0 last:pr-0 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Solutions */}
      <section className="border-b border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#0055FF] mb-3">What We Build</p>
              <h2 className="text-4xl font-bold text-gray-900">Our Software Solutions</h2>
            </div>
            <Link to="/services" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <div key={index} className="group border border-gray-200 p-8 hover:border-gray-400 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-3xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors select-none">{solution.number}</span>
                  <div className="w-10 h-10 border border-gray-300 group-hover:border-gray-400 transition-colors flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.5" />
                      <path d="M5 7h4M7 5v4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{solution.description}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-xs font-bold text-[#0055FF] flex items-center gap-1">Learn more <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Projects with real images */}
      <section className="border-b border-gray-200 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0055FF] mb-3">Portfolio</p>
            <h2 className="text-4xl font-bold text-gray-900">Past Projects Highlights</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="group border border-gray-200 bg-white hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="relative overflow-hidden h-48">
                  <ProjectImage title={project.title} index={index} />
                  <span className="absolute top-3 left-3 bg-white border border-gray-200 text-xs font-bold px-2 py-1 text-gray-600 z-10">
                    {project.tag}
                  </span>
                </div>
                <div className="p-5 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{project.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{project.year}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0055FF] transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#0055FF] mb-3">Social Proof</p>
              <h2 className="text-4xl font-bold text-gray-900">Customer Feedback</h2>
            </div>
            <Link to="/testimonials" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
              All testimonials <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No reviews yet. Be the first to share your experience!</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 p-8 bg-white relative">
                  <span className="absolute top-6 right-8 text-6xl text-gray-100 font-serif leading-none select-none">"</span>
                  <div className="flex mb-5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#0055FF] text-[#0055FF]" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed relative z-10">"{review.comment}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Banner */}
      <section className="border-b border-gray-200 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0055FF] border border-[#0055FF] px-2 py-1">Upcoming</span>
              <span className="text-white font-medium">AI Innovation Summit 2026</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400 text-sm">June 15–17, 2026 · Kathmandu</span>
            </div>
            <Link to="/events" className="text-sm font-bold text-white flex items-center gap-2 hover:text-gray-300 transition-colors">
              Register Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0055FF] mb-3">Knowledge</p>
            <h2 className="text-4xl font-bold text-gray-900">Latest Articles</h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading articles...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No articles yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {blogs.map((article) => (
                <Link key={article.id} to={`/blog/${article.slug}`} className="group border border-gray-200 p-8 bg-white hover:border-gray-400 hover:shadow-md transition-all duration-200 block">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0055FF]/10 to-indigo-100 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-[#0055FF]" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TAG_COLORS[article.tag] || TAG_COLORS.Default}`}>
                      {article.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0055FF] transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.datePublished}</span>
                  </div>
                  <span className="text-sm font-bold text-[#0055FF] flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;