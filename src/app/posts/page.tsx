import { getPosts } from '@/lib/data';
import { BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: BlogPost) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="block bg-card hover:bg-card/90 rounded-lg shadow-lg overflow-hidden transition-colors duration-200"
          >
            {post.coverImage && (
              <div className="relative w-full h-48">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-heading">{post.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                By {post.author} on {new Date(post.publishedDate).toLocaleDateString()}
              </p>
              <p className="text-muted-foreground line-clamp-3">{post.shortSnippet}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
