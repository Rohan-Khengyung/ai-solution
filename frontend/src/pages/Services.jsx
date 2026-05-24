import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

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
      icon: Sparkles,
      gradient: 'from-indigo-500 to-purple-500',
      bgLight: 'bg-indigo-50',
      numberColor: 'text-indigo-600',
      glowColor: 'from-indigo-400 to-purple-400',
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
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50',
      numberColor: 'text-blue-600',
      glowColor: 'from-blue-400 to-cyan-400',
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
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50',
      numberColor: 'text-emerald-600',
      glowColor: 'from-emerald-400 to-teal-400',
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/70">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-48 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            WHAT WE OFFER
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
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
              className="group flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className={`font-black ${service.numberColor} text-base group-hover:scale-110 transition-transform duration-200`}>
                {service.number}
              </span>
              {service.title}
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-20">
          {services.map((service, idx) => (
            <div key={idx} id={`service-${idx}`} className="scroll-mt-20 group/service">
              <div className="grid md:grid-cols-5 gap-8 md:gap-12">
                {/* Left Column (Sticky) — enhanced number visibility */}
                <div className="md:col-span-2">
                  <div className="md:sticky md:top-24">
                    {/* Large, vibrant service number with glow */}
                    <div className="relative inline-block mb-4">
                      {/* Soft blurred glow behind number */}
                      <div className={`absolute -inset-2 bg-gradient-to-r ${service.glowColor} rounded-2xl blur-xl opacity-30 group-hover/service:opacity-60 transition-opacity duration-500`} />
                      <span className={`relative text-7xl md:text-7xl font-black leading-none tracking-tighter ${service.numberColor} drop-shadow-sm select-none block`}>
                        {service.number}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-2 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-md`}>
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {service.title}
                      </h2>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    <Link
                      to="/contact"
                      className="group/btn inline-flex items-center gap-2 text-sm font-bold text-indigo-600 border-2 border-indigo-200 px-5 py-2.5 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all duration-200"
                    >
                      Get Started 
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Right Column – Features Table (elevated card) */}
                <div className="md:col-span-3">
                  <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`px-6 py-4 ${service.bgLight} border-b border-gray-100`}>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                        <span className="w-8 h-px bg-indigo-300"></span>
                        Key Features
                      </p>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {service.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="px-6 py-4 flex items-start gap-4 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent transition-all duration-200 group/feature"
                        >
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform">
                            <Check className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <span className="text-sm text-gray-700 group-hover/feature:text-gray-900 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {idx < services.length - 1 && (
                <div className="mt-16 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action Section — vibrant gradient border & background */}
        <div className="relative mt-20 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100 p-8 md:p-12 text-center shadow-md hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20" />
          
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Ready to Start?
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Let's Build Something <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Together</span>
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Tell us about your project and we'll recommend the best solution for your needs.
          </p>
          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Contact Our Team 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Services;