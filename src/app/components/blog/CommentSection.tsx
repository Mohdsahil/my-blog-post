'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@/lib/types'; 
import { toast } from 'react-hot-toast'; 

interface CommentSectionProps {
  postId: string; 
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [formErrors, setFormErrors] = useState<{ author?: string; content?: string }>({});

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: Comment[] = await res.json();
      setComments(data);
    } catch (error: any) {
      toast.error(`Failed to load comments: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const validateForm = () => {
    const errors: { author?: string; content?: string } = {};
    if (!author.trim()) {
      errors.author = 'Author name is required.';
    }
    if (!commentContent.trim()) {
      errors.content = 'Comment cannot be empty.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, author, content: commentContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const newComment: Comment = await res.json();
      setComments((prevComments) => [...prevComments, newComment]);
      setAuthor(''); 
      setCommentContent('');
      setFormErrors({});
      toast.success('Comment added successfully!');
    } catch (error: any) {
      toast.error(`Error adding comment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 text-foreground">
      <h2 className="text-3xl font-bold mb-6">Comments</h2>


      <div className="p-6 rounded-lg shadow-md mb-8 border border-gray-100 ">
        <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label htmlFor="commentAuthor" className="block text-sm font-medium mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="commentAuthor"
              className={`w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
                          
                          ${formErrors.author ? 'border-red-500' : 'border-gray-300 '}`}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={submitting}
            />
            {formErrors.author && <p className="text-red-500 text-xs mt-1">{formErrors.author}</p>}
          </div>
          <div>
            <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Your Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="commentContent"
              rows={4}
              className={`w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
                           
                          ${formErrors.content ? 'border-red-500' : 'border-gray-300 '}`}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={submitting}
            ></textarea>
            {formErrors.content && <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700
                       transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Existing Comments List */}
      {loading ? (
        <p className="text-center text-gray-600 ">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-600 ">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className=" p-5 rounded-lg shadow-sm border border-gray-100 ">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm ">
                  {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className=" ">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
