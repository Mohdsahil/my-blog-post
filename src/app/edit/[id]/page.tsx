'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/blog/RichTextEditor';
import { BlogPost } from '@/lib/types';
import { toast } from 'react-hot-toast'; 

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = params;
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [shortSnippet, setShortSnippet] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error('Post not found');
        }
        const data: BlogPost = await res.json();
        setPost(data);
        setTitle(data.title);
        setAuthor(data.author);
        setCoverImage(data.coverImage || '');
        setContent(data.content);
        setShortSnippet(data.shortSnippet);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post for editing.');
        router.push('/'); // Redirect if post not found or error
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title) newErrors.title = 'Title is required.';
    if (!author) newErrors.author = 'Author name is required.';
    if (!content) newErrors.content = 'Blog body is required.';
    if (coverImage && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/.test(coverImage)) {
      newErrors.coverImage = 'Invalid image URL.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    setSubmitting(true);
    try {
      const updatedPostData: Partial<Omit<BlogPost, 'id' | 'publishedDate' | 'slug'>> = {
        title,
        author,
        coverImage: coverImage || undefined,
        content,
        shortSnippet: shortSnippet || content.substring(0, 200) + '...',
      };

      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPostData),
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await res.json();
      toast.success('Post updated successfully!');
      router.push(`/posts/${updatedPost.slug}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      toast.success('Post deleted successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl mt-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center text-xl mt-8 text-red-600">Post not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-card text-foreground rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center ">Edit Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block  text-sm font-bold mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            className={`shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your amazing blog post title"
          />
          {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="author" className="block  text-sm font-bold mb-2">
            Author Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author"
            className={`shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline ${errors.author ? 'border-red-500' : ''}`}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your Name"
          />
          {errors.author && <p className="text-red-500 text-xs italic mt-1">{errors.author}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="coverImage" className="block  text-sm font-bold mb-2">
            Cover Image URL (optional)
          </label>
          <input
            type="text"
            id="coverImage"
            className={`shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline ${errors.coverImage ? 'border-red-500' : ''}`}
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImage && <p className="text-red-500 text-xs italic mt-1">{errors.coverImage}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="shortSnippet" className="block  text-sm font-bold mb-2">
            Short Snippet/Summary (optional)
          </label>
          <textarea
            id="shortSnippet"
            className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline min-h-[80px]"
            value={shortSnippet}
            onChange={(e) => setShortSnippet(e.target.value)}
            placeholder="A brief summary of your blog post (max 200 chars)"
            maxLength={200}
          />
        </div>

        <div className="mb-6">
          <label className="block  text-sm font-bold mb-2">
            Blog Body <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your blog content here... Use {{block name='Block Name' key='value'}} for custom UI components."
          />
          {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content}</p>}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      </form>
    </div>
  );
}