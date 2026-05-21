// src/pages/Services.jsx
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      id: '01',
      title: 'AI Virtual Assistant',
      description:
        'Intelligent conversational AI that understands natural language, supports 40+ languages, and integrates seamlessly with your CRM.',
      features: [
        'Natural language understanding and generation',
        'Multi-language support across 40+ languages',
        'Integration with existing CRM systems',
        'Custom training on your proprietary data',
        'Real-time analytics and reporting dashboard',
        'Seamless human handoff when needed',
      ],
      ctaText: 'Get Started →',
      ctaLink: '/contact',
    },
    {
      id: '02',
      title: 'Prototyping Solutions',
      description:
        'Accelerate your product development with our AI-powered prototyping tools. From concept to working prototype in record time, our platform helps teams iterate faster and smarter.',
      features: [
        'Automated code generation from designs',
        'AI-assisted component libraries',
        'Real-time collaboration features',
        'Version control and rollback capabilities',
        'Export to production-ready code',
        'Integration with popular design tools',
      ],
      ctaText: 'Get Started →',
      ctaLink: '/contact',
    },
    {
      id: '03',
      title: 'Automation Platform',
      description:
        'Transform your business operations with our comprehensive automation platform. Reduce manual tasks, minimize errors, and free your team to focus on strategic initiatives.',
      features: [
        'Visual workflow automation builder',
        'API integrations with 100+ services',
        'Intelligent document processing (IDP)',
        'Predictive analytics and business insights',
        'Custom automation rules engine',
        'Enterprise-grade security and compliance',
      ],
      ctaText: 'Get Started →',
      ctaLink: '/contact',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-blue-600 font-semibold uppercase tracking-wide">WHAT WE OFFER</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Our Services</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive AI solutions designed to transform your business operations and accelerate innovation.
        </p>
      </div>

      {/* Service Cards / Sections */}
      {services.map((service, idx) => (
        <div key={service.id} className={`mb-16 ${idx !== 0 ? 'pt-8 border-t' : ''}`}>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Title & description */}
            <div>
              <span className="text-5xl font-bold text-blue-600 opacity-30">{service.id}</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">{service.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <Link
                to={service.ctaLink}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
              >
                {service.ctaText}
              </Link>
            </div>

            {/* Right: Features list */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Key Features
              </h3>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      {/* Call to Action Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          Let's Build Something Together. Tell us about your project and we'll recommend the best solution for your needs.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Contact Our Team →
        </Link>
      </div>
    </div>
  );
};

export default Services;