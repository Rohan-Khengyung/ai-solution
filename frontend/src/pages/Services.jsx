import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain, Cpu, Zap, BarChart3, Globe, Shield,
  CheckCircle, ArrowRight, MessageSquare, Database, Code2, Layers,
  GraduationCap, Clock, Users, FileText, Briefcase, HeartPulse, Building2, 
  Cpu as CpuIcon, GraduationCap as GradCapIcon, Award, TrendingUp
} from 'lucide-react';
import { getActiveServices, getActiveTrainings, getActiveIndustries } from '../services/api';

// Map icon names to Lucide components
const iconMap = {
  Brain: Brain,
  Cpu: Cpu,
  Zap: Zap,
  BarChart3: BarChart3,
  Globe: Globe,
  Shield: Shield,
  Database: Database,
  Code2: Code2,
  Layers: Layers,
  GraduationCap: GraduationCap,
  Clock: Clock,
  Users: Users,
  FileText: FileText,
  Briefcase: Briefcase,
  HeartPulse: HeartPulse,
  Building2: Building2,
  Award: Award,
  TrendingUp: TrendingUp,
  CpuIcon: CpuIcon,
  GradCapIcon: GradCapIcon,
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, tRes, iRes] = await Promise.all([
          getActiveServices(),
          getActiveTrainings(),
          getActiveIndustries()
        ]);
        setServices(sRes.data.data || []);
        setTrainings(tRes.data.data || []);
        setIndustries(iRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch services data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to render icon from string
  const renderIcon = (iconName, size = 32, color = 'currentColor') => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent size={size} color={color} />;
    }
    // Fallback icon
    return <Layers size={size} color={color} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: '#030712', paddingTop: '80px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, #060f24 0%, #030712 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '24px',
          }}>
            <Layers size={14} color="#6366f1" />
            <span style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 500 }}>Our Services</span>
          </div>
          <h1 style={{
            color: '#f1f5f9',
            marginBottom: '20px',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            AI Solutions for Every{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Industry
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            We offer a comprehensive suite of AI-powered services designed to solve real business challenges and deliver measurable results.
          </p>
        </motion.div>
      </section>

      {/* Services List (horizontal cards) */}
      <section style={{ padding: '80px 24px 80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {services.length === 0 ? (
            <p className="text-slate-400 text-center py-10">No services available.</p>
          ) : (
            services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.05 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                  gap: '48px',
                  padding: '48px',
                  borderRadius: '20px',
                  background: 'rgba(10, 18, 42, 0.7)',
                  border: '1px solid rgba(99, 102, 241, 0.12)',
                  backdropFilter: 'blur(20px)',
                  alignItems: 'start',
                }}
              >
                {/* Left side: description & CTA */}
                <div>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: `${service.color}15`,
                    border: `1px solid ${service.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: service.color, marginBottom: '24px',
                  }}>
                    {renderIcon(service.icon, 32, service.color)}
                  </div>
                  <span style={{ color: service.color, fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    {service.subtitle}
                  </span>
                  <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '1.8rem', fontWeight: 600 }}>{service.title}</h2>
                  <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.95rem' }}>
                    {service.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
                    {service.useCases.map(uc => (
                      <span key={uc} style={{
                        padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500,
                        background: `${service.color}12`,
                        border: `1px solid ${service.color}25`,
                        color: service.color,
                      }}>
                        {uc}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link
                      to="/contact"
                      style={{
                        padding: '12px 24px', borderRadius: '10px', textDecoration: 'none',
                        color: 'white', fontWeight: 600, fontSize: '0.95rem',
                        background: `linear-gradient(135deg, ${service.color}, ${service.color}cc)`,
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                      }}
                    >
                      Get a Quote <ArrowRight size={16} />
                    </Link>
                    {service.learnMoreLink && service.learnMoreLink !== '#' && (
                      <Link
                        to={service.learnMoreLink}
                        style={{
                          padding: '12px 24px', borderRadius: '10px', textDecoration: 'none',
                          color: service.color, fontWeight: 600, fontSize: '0.95rem',
                          border: `1px solid ${service.color}40`,
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: 'transparent',
                        }}
                      >
                        Learn More <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right side: features list */}
                <div>
                  <h4 style={{ color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>
                    What's Included
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {service.features.map(feature => (
                      <div key={feature} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Training Section */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              marginBottom: '16px',
            }}>
              <GraduationCap size={14} color="#a78bfa" />
              <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 500 }}>Professional Development</span>
            </div>
            <h2 style={{
              color: '#f1f5f9',
              fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}>
              Training &amp; Upskilling{' '}
              <span style={{
                background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Programs
              </span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Empower your teams with the knowledge and skills to leverage AI effectively.
            </p>
          </motion.div>

          {trainings.length === 0 ? (
            <p className="text-slate-400 text-center py-10">No training programs available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {trainings.map((program, idx) => (
                <motion.div
                  key={program._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.07 }}
                  style={{
                    padding: '36px 40px',
                    borderRadius: '16px',
                    background: 'rgba(10, 18, 42, 0.6)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                    backdropFilter: 'blur(12px)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: '24px',
                    alignItems: 'start',
                  }}
                >
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '14px',
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#a78bfa',
                  }}>
                    {renderIcon(program.icon, 28, '#a78bfa')}
                  </div>

                  <div>
                    <h3 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 600, marginBottom: '4px' }}>
                      {program.title}
                    </h3>
                    <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '12px' }}>
                      {program.subtitle}
                    </span>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                      {program.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                        <Clock size={16} /> {program.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                        <Users size={16} /> {program.audience}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                        <FileText size={16} /> {program.format}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {program.keyTopics.map(topic => (
                        <span key={topic} style={{
                          padding: '3px 12px', borderRadius: '999px',
                          background: 'rgba(139, 92, 246, 0.08)',
                          border: '1px solid rgba(139, 92, 246, 0.15)',
                          color: '#c4b5fd', fontSize: '0.8rem',
                        }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link
                      to="/contact"
                      style={{
                        padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
                        color: 'white', fontWeight: 600, fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Enquire <ArrowRight size={14} />
                    </Link>
                    {program.learnMoreLink && program.learnMoreLink !== '#' && (
                      <Link
                        to={program.learnMoreLink}
                        style={{
                          padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
                          color: '#a78bfa', fontWeight: 500, fontSize: '0.85rem',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          whiteSpace: 'nowrap',
                          background: 'transparent',
                        }}
                      >
                        Learn More <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Industries Section */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '56px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '16px',
            }}>
              <Briefcase size={14} color="#34d399" />
              <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 500 }}>Industries We Serve</span>
            </div>
            <h2 style={{
              color: '#f1f5f9',
              fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}>
              Transforming{' '}
              <span style={{
                background: 'linear-gradient(135deg, #34d399, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Industries
              </span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Our AI solutions are tailored to meet the unique challenges of each industry.
            </p>
          </motion.div>

          {industries.length === 0 ? (
            <p className="text-slate-400 text-center py-10">No industries listed.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
              {industries.map((industry, idx) => (
                <motion.div
                  key={industry._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  style={{
                    padding: '32px 24px',
                    borderRadius: '16px',
                    background: 'rgba(10, 18, 42, 0.6)',
                    border: `1px solid ${industry.color}25`,
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: `${industry.color}15`,
                    border: `2px solid ${industry.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: industry.color,
                  }}>
                    {renderIcon(industry.icon, 28, industry.color)}
                  </div>
                  <h3 style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
                    {industry.name}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {industry.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '0 24px 120px' }}>
        <motion.div
          {...fadeUp}
          style={{
            maxWidth: '900px', margin: '0 auto',
            borderRadius: '24px', padding: '64px 48px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}
        >
          <MessageSquare size={48} color="#6366f1" style={{ marginBottom: '24px' }} />
          <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '2rem', fontWeight: 600 }}>
            Not Sure Which Service Fits You?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '36px', lineHeight: 1.7 }}>
            Talk to our solution architects for a free 30-minute consultation. We'll listen to your challenges and recommend the best approach.
          </p>
          <Link
            to="/contact"
            style={{
              padding: '14px 36px', borderRadius: '10px', textDecoration: 'none',
              color: 'white', fontWeight: 700, fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
            }}
          >
            Book Free Consultation <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;