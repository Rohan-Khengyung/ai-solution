import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Clock, User, Tag, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshReflectorMaterial, Sparkles as ThreeSparkles } from '@react-three/drei';
import * as THREE from 'three';
import { getApprovedReviews, getBlogPosts } from '../services/api';

// --- Enhanced 3D Animated Core ---
const AnimatedShape = () => {
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particles = [];
  for (let i = 0; i < 60; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.0;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    particles.push([x, y, z]);
  }

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.2}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1e40af"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
      {particles.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <ThreeSparkles count={30} scale={[2.5, 2.5, 2.5]} size={0.4} speed={0.3} color="#3b82f6" />
    </group>
  );
};

// --- 3D Scene ---
const Hero3DIllustration = () => {
  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-3, 2, 4]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[0, -2, 3]} intensity={0.5} color="#a855f7" />
        <AnimatedShape />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={20}
          roughness={0.9}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0f172a"
          metalness={0.8}
        />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl" />
    </div>
  );
};

// --- Animated counter for stats ---
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericValue = parseFloat(value);
          let start = 0;
          const duration = 1500;
          const step = (timestamp, startTime) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * numericValue);
            setCount(current);
            if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
          };
          requestAnimationFrame((t) => step(t, t));
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
      {count}{suffix}
    </span>
  );
};

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const solutions = [
    { number: '01', title: 'AI Virtual Assistant', description: 'Intelligent conversational AI to enhance customer experience and automate support tasks 24/7.', icon: Sparkles },
    { number: '02', title: 'Prototyping Solutions', description: 'Rapid AI-powered design and development tools to accelerate your product iteration cycle.', icon: Zap },
    { number: '03', title: 'Automation Platform', description: 'End-to-end workflow automation to streamline business processes and increase efficiency.', icon: Shield },
  ];

  const stats = [
    { value: '70', label: 'Faster Response Times', suffix: '%' },
    { value: '500', label: 'Clients Worldwide', suffix: '+' },
    { value: '3', label: 'Faster Prototyping', suffix: '×' },
    { value: '60', label: 'Process Automation', suffix: '%' },
  ];

  const projects = [
    { title: 'Healthcare AI Integration', year: '2025', tag: 'Healthcare', gradient: 'from-emerald-500 to-teal-500' },
    { title: 'Finance Automation', year: '2025', tag: 'Finance', gradient: 'from-blue-500 to-indigo-500' },
    { title: 'Retail Customer Experience', year: '2024', tag: 'Retail', gradient: 'from-amber-500 to-orange-500' },
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
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="relative max-w-7xl mx-auto px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">AI-Powered Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                AI Solutions for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                  Digital Employee
                </span>{" "}
                Experience
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
                Speeding up design, engineering, and innovation with cutting-edge artificial intelligence.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-sm font-bold tracking-wide rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  Request a Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200 px-8 py-4 rounded-full hover:border-blue-300 hover:bg-white transition-all duration-200"
                >
                  View Services
                </Link>
              </div>
            </div>
            <div className="relative">
              <Hero3DIllustration />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-blue-200 rounded-xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -z-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip - upgraded with gradient and micro-animations */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-y border-blue-100 shadow-md">
        {/* Animated background dots */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        
        <div className="relative max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="group space-y-2 hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center items-baseline">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700 group-hover:text-blue-800 transition-colors">
                  {stat.label}
                </div>
                {/* Micro line animation */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Solutions (unchanged but background upgraded) */}
      <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-300"></span> What We Build
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Our Software Solutions</h2>
            </div>
            <Link to="/services" className="group inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              View all services <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-6">
                  <span className="text-5xl font-black text-slate-200 group-hover:text-blue-100 transition-colors select-none">
                    {solution.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <solution.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{solution.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{solution.description}</p>
                <div className="pt-6 border-t border-slate-100">
                  <span className="text-sm font-bold text-blue-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Projects Highlights - upgraded background with animated gradient */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-700 to-indigo-900">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="mb-16 text-white">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-300"></span> Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Past Projects Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={`https://images.unsplash.com/photo-${index === 0 ? '1576091160399-112ba8d25d1d' : index === 1 ? '1554224155-6726b3ff858f' : '1563013544-824ae1b704d3'}?w=800&h=500&fit=crop`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-slate-800 shadow-sm z-10">
                    {project.tag}
                  </span>
                </div>
                <div className="p-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">{project.year}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (unchanged, vibrant background already) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-300"></span> Social Proof
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Customer Feedback</h2>
            </div>
            <Link to="/testimonials" className="group inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              All testimonials <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-16 text-slate-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No reviews yet. Be the first to share your experience!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="group relative bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="absolute top-6 right-8 text-7xl text-blue-100 font-serif leading-none select-none group-hover:text-blue-200 transition-colors">
                    "
                  </span>
                  <div className="flex mb-5 gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed relative z-10">"{review.comment}"</p>
                  <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{review.name}</p>
                      <p className="text-xs text-slate-500">{review.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Banner (unchanged, already vibrant) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-700 to-indigo-900">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 text-xs font-bold text-blue-300 uppercase tracking-wider backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Upcoming
              </span>
              <span className="text-white font-semibold text-lg">AI Innovation Summit 2026</span>
              <span className="text-blue-300 hidden md:inline">·</span>
              <span className="text-blue-200 text-sm">June 15–17, 2026 · Kathmandu</span>
            </div>
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white/20 transition-all duration-200"
            >
              Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles (subtle background upgrade) */}
      <section className="py-24 bg-gradient-to-t from-slate-50 via-white to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-blue-300"></span> Knowledge
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Latest Articles</h2>
          </div>
          {loading ? (
            <div className="text-center py-16 text-slate-400">Loading articles...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No articles yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group block bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Tag className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${TAG_COLORS[article.tag] || TAG_COLORS.Default}`}>
                      {article.tag}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-5">{article.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-6">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.datePublished}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 8s ease infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </>
  );
};

export default Home;