import { useParams, Link } from 'react-router-dom'
import { mockBlogPosts } from '../utils/mockData'

const BlogPost = () => {
  const { id } = useParams()
  const post = mockBlogPosts.find(p => p.id === parseInt(id))

  if (!post) {
    return <div className="container mx-auto px-4 py-20 text-center">Post not found</div>
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-center gap-4 text-gray-300">
            <span>{post.date}</span>
            <span>•</span>
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <img src={post.image} alt={post.title} className="w-full rounded-xl shadow-md mb-8" />
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-12 pt-6 border-t">
            <Link to="/blog" className="text-blue-600 font-semibold hover:text-blue-700">← Back to all posts</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogPost