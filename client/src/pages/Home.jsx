import { Link } from 'react-router-dom'
import StatsCard from '../components/StatsCard'
import { mockPortfolio, mockArticles, mockStats } from '../utils/mockData'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI Solutions for Digital Employee Experience
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Speeding up design, engineering, and innovation with cutting-edge artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Request Demo →
              </Link>
              <Link to="/services" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard number="70%" label="FASTER RESPONSE TIMES" />
            <StatsCard number="500+" label="CLIENTS WORLDWIDE" />
            <StatsCard number="3×" label="FASTER PROTOTYPING" />
            <StatsCard number="60%" label="PROCESS AUTOMATION" />
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Past Projects Highlights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore some of our successful implementations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockPortfolio.map(project => (
              <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Link to="/services" className="text-blue-600 font-medium hover:text-blue-700">Learn more →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-gray-600">Insights from our AI experts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mockArticles.map(article => (
              <div key={article.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link to={`/blog/${article.id}`} className="text-blue-600 font-medium hover:text-blue-700">Read article →</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="text-blue-600 font-semibold hover:text-blue-700">View all articles →</Link>
          </div>
        </div>
      </section>

      {/* Upcoming Event Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Innovation Summit 2026</h2>
          <p className="text-xl mb-6">June 15–17, 2026 · Kathmandu</p>
          <Link to="/events" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Register Now →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home