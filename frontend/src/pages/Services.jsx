import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain, Cpu, Zap, BarChart3, Globe, Shield,
  CheckCircle, ArrowRight, MessageSquare, Database, Code2, Layers
} from 'lucide-react';

const SERVICES = [
  {
    icon: <Brain size={32} />,
    color: '#6366f1',
    title: 'AI-Powered Virtual Assistant',
    subtitle: 'Intelligent Conversational AI',
    desc: 'Our virtual assistant platform uses advanced natural language processing to understand context, intent, and sentiment. It handles thousands of simultaneous conversations while maintaining personalised experiences for each user.',
    features: [
      'Multi-language support (40+ languages)',
      'Context-aware conversation management',
      'Seamless human escalation with full context transfer',
      'Integration with CRM, ERP, and helpdesk systems',
      'Real-time analytics and conversation insights',
      'Custom personality and brand voice configuration',
    ],
    useCases: ['Customer Support', 'HR Automation', 'Sales Assistance', 'IT Helpdesk'],
  },
  {
    icon: <Code2 size={32} />,
    color: '#06b6d4',
    title: 'Custom Software Development',
    subtitle: 'Bespoke Engineering Solutions',
    desc: 'From greenfield applications to complex system modernisation, our engineering teams deliver production-ready software built with modern, scalable architectures. We specialise in AI-augmented development workflows.',
    features: [
      'Full-stack web and mobile development',
      'Microservices and API-first architecture',
      'AI/ML model integration and fine-tuning',
      'Agile delivery with bi-weekly demonstrations',
      'Comprehensive testing (unit, integration, e2e)',
      'Post-launch maintenance and optimisation',
    ],
    useCases: ['Enterprise Platforms', 'SaaS Products', 'Mobile Apps', 'API Development'],
  },
  {
    icon: <Zap size={32} />,
    color: '#10b981',
    title: 'Rapid Prototyping Solutions',
    subtitle: 'From Idea to Working Demo in Weeks',
    desc: 'Validate your product vision before committing to full-scale development. Our prototype sprints combine AI-powered development tools with experienced engineers to deliver clickable, testable prototypes at record speed.',
    features: [
      'Two-week prototype sprint methodology',
      'Interactive, testable prototypes (not mockups)',
      'User testing and feedback integration',
      'Technology stack recommendation and validation',
      'Detailed technical specification for production',
      'Handoff-ready codebase for your team',
    ],
    useCases: ['Startup MVPs', 'Innovation Labs', 'Concept Validation', 'Investor Demos'],
  },
  {
    icon: <BarChart3 size={32} />,
    color: '#f59e0b',
    title: 'Data Analytics & Intelligence',
    subtitle: 'Turn Data into Competitive Advantage',
    desc: 'Our AI analytics platform ingests data from any source, applies machine learning models to identify patterns, and delivers actionable insights through beautiful, interactive dashboards that update in real-time.',
    features: [
      'Real-time data pipeline architecture',
      'Predictive modelling and forecasting',
      'Natural language querying ("Ask your data")',
      'Automated anomaly detection and alerts',
      'Custom KPI dashboards and reporting',
      'Data governance and compliance tools',
    ],
    useCases: ['Business Intelligence', 'Predictive Maintenance', 'Sales Forecasting', 'Risk Management'],
  },
  {
    icon: <Globe size={32} />,
    color: '#8b5cf6',
    title: 'Digital Transformation',
    subtitle: 'Strategic AI Adoption Roadmap',
    desc: 'We guide organisations through the complex journey of digital transformation — from initial AI readiness assessment to full-scale deployment. Our consultants have delivered transformation programmes for enterprises across 15 industries.',
    features: [
      'AI readiness and maturity assessment',
      'Technology selection and vendor evaluation',
      'Change management and training programmes',
      'Process automation identification and prioritisation',
      'ROI modelling and business case development',
      'Ongoing optimisation and scaling support',
    ],
    useCases: ['Legacy Modernisation', 'Process Automation', 'Cultural Change', 'AI Strategy'],
  },
  {
    icon: <Database size={32} />,
    color: '#ec4899',
    title: 'Cloud Integration & Architecture',
    subtitle: 'Scalable, Secure Cloud Infrastructure',
    desc: 'Design and implement cloud architectures that can handle millions of users, petabytes of data, and mission-critical workloads. We specialise in AI/ML infrastructure and cost-optimised cloud deployments.',
    features: [
      'Multi-cloud strategy (AWS, Azure, GCP)',
      'Kubernetes orchestration and DevOps automation',
      'AI/ML infrastructure (GPUs, data lakes)',
      'Security hardening and compliance (ISO 27001, SOC 2)',
      'Cost optimisation — typically 30-40% savings',
      '99.99% uptime SLA architecture design',
    ],
    useCases: ['Cloud Migration', 'AI Infrastructure', 'DevOps Automation', 'Cost Reduction'],
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: 'easeOut' },
};

const Services = () => {
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
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',  // Much larger, responsive
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

      {/* Services List */}
      <section style={{ padding: '80px 24px 120px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
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
                  {service.icon}
                </div>
                <span style={{ color: service.color, fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  {service.subtitle}
                </span>
                <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '1.8rem', fontWeight: 600 }}>{service.title}</h2>
                <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.95rem' }}>
                  {service.desc}
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
          ))}
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