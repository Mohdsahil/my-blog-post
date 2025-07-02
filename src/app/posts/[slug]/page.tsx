import { getPostBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { parseBlocks } from "@/lib/blockParser";
import CustomBlockRenderer from "@/app/components/blog/CustomBlockRenderer";
import CommentSection from "@/app/components/blog/CommentSection";
import { BlogPost } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: post.title,
    description: post.shortSnippet,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post: BlogPost | undefined = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { text: contentWithoutBlocks, blocks } = parseBlocks(post.content);

  const contentParts = contentWithoutBlocks.split(
    /(__BLOCK_PLACEHOLDER_\d+__)/g
  );

  return (
    <div className="bg-card text-foreground max-w-4xl mx-auto p-8 rounded-lg shadow-lg">
      {post.coverImage && (
        <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
      <h1 className="text-4xl text-heading font-extrabold mb-4">
        {post.title}
      </h1>
      <p className="text-gray-600 text-sm mb-6">
        By <span className="font-semibold">{post.author}</span> on{" "}
        {new Date(post.publishedDate).toLocaleDateString()}
      </p>

      <div className="prose prose-lg max-w-none leading-relaxed">
        {contentParts.map((part, index) => {
          if (part.startsWith("__BLOCK_PLACEHOLDER_")) {
            const blockIndex = parseInt(
              part.replace("__BLOCK_PLACEHOLDER_", "").replace("__", "")
            );
            const block = blocks[blockIndex];
            return block ? (
              <CustomBlockRenderer key={index} block={block} />
            ) : null;
          }
          return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        })}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <Link
          href={`/edit/${post.id}`}
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Edit Post
        </Link>
       
      </div>
      {post.id && <CommentSection postId={post.id} />}
    </div>
  );
}
