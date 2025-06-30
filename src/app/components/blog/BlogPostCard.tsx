import { BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-card text-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {post.coverImage && (
        <div className="relative w-full h-48">
          <Image
            src={post.coverImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      )}
      <div className="p-6">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-2xl font-bold mb-2 text-link transition-colors duration-200">
            {post.title}
          </h2>
        </Link>
        <p className="text-foreground text-sm mb-2">
          By {post.author} on {new Date(post.publishedDate).toLocaleDateString()}
        </p>
        <p className="text-foreground mb-4 line-clamp-3">
          {post.shortSnippet}
        </p>
        <Link href={`/posts/${post.slug}`} className="text-link hover:underline">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;