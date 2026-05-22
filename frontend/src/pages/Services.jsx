import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      number: '01',
      title: 'AI Virtual Assistant',
      description:
        'Our AI Virtual Assistant provides intelligent, context-aware support for your customers 24/7. Built on advanced natural language processing, it understands complex queries and delivers accurate responses.',
      features: [
        'Natural language understanding and generation',
        'Multi-language support across 40+ languages',
        'Integration with existing CRM systems',
        'Custom training on your proprietary data',
        'Real-time analytics and reporting dashboard',
        'Seamless human handoff when needed',
      ],
    },
    {
      number: '02',
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
    },
    {
      number: '03',
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
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
            WHAT WE OFFER
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Comprehensive AI solutions designed to transform your business operations
            and accelerate innovation.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-3 mb-16 pb-8 border-b border-gray-200">
          {services.map((service, idx) => (
            <a
              key={idx}
              href={`#service-${idx}`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium text-gray-600 hover:border-gray-500 hover:text-gray-900 transition-colors duration-150"
            >
              <span className="text-blue-600 font-bold">{service.number}</span>
              {service.title}
            </a>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-20">
          {services.map((service, idx) => (
            <div key={idx} id={`service-${idx}`} className="scroll-mt-20">
              <div className="grid md:grid-cols-5 gap-8 md:gap-12">
                {/* Left Column (Sticky) */}
                <div className="md:col-span-2">
                  <div className="md:sticky md:top-24">
                    <span className="text-7xl font-bold text-gray-100 block mb-2 select-none leading-none">
                      {service.number}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 border border-blue-600 px-5 py-2.5 hover:bg-blue-600 hover:text-white transition-colors duration-150"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Column – Features Table */}
                <div className="md:col-span-3">
                  <div className="border border-gray-200 divide-y divide-gray-200">
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Key Features
                      </p>
                    </div>
                    {service.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {idx < services.length - 1 && (
                <div className="mt-16 border-t border-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 border border-gray-200 p-8 md:p-12 text-center bg-gray-50">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">
            Ready to Start?
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Let's Build Something Together
          </h3>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Tell us about your project and we'll recommend the best solution for your needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 text-sm font-bold hover:bg-blue-700 transition-colors duration-150"
          >
            Contact Our Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Services;