"use client";

import { useState, useEffect, useRef } from "react";
import BlogPostCard from "@/app/components/blog/BlogPostCard";
import { BlogPost } from "@/lib/types";
import Link from "next/link";
import { toast } from "react-hot-toast";

const POSTS_PER_PAGE = 6;

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("");
  
  const [triggerSearch, setTriggerSearch] = useState(0);

  const keywordInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
    
        const queryParams = new URLSearchParams();
        queryParams.append("page", String(page));
        queryParams.append("pageSize", String(POSTS_PER_PAGE));
        if (keyword.trim()) {
          queryParams.append("keyword", keyword.trim());
        }
        if (author.trim()) {
          queryParams.append("author", author.trim());
        }

        const res = await fetch(`/api/posts?${queryParams.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to fetch blog posts from API");
        }
        const data = await res.json();
        const newPosts: BlogPost[] = data.posts;
        const totalCount: number = data.totalCount;

        setPosts((prevPosts) => {
        
          if (page === 1 && triggerSearch > 0) {
            
            return newPosts;
          }
          const uniqueNewPosts = newPosts.filter(
            (newPost) =>
              !prevPosts.some((prevPost) => prevPost.id === newPost.id)
          );
          return [...prevPosts, ...uniqueNewPosts];
        });

        setHasMore(page * POSTS_PER_PAGE < totalCount);

        if (initialLoad && newPosts.length === 0) {
          toast("No posts found. Be the first to create one!", { icon: "📝" });
        }
      } catch (error) {
        
        toast.error("Failed to load blog posts. Please try again later.");
        setHasMore(false); 
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchBlogPosts();
  }, [page, initialLoad, triggerSearch]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = () => {
    setPage(1); 
    setPosts([]); 
    setHasMore(true);
    setInitialLoad(false); 
    setTriggerSearch((prev) => prev + 1);
  };

  const handleClearSearch = () => {
    setKeyword("");
    setAuthor("");
    if (keywordInputRef.current) keywordInputRef.current.value = "";
    if (authorInputRef.current) authorInputRef.current.value = "";
    setPage(1); 
    setPosts([]); 
    setHasMore(true); 
    setInitialLoad(true); 
    setTriggerSearch((prev) => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.24)*2)] flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-heading leading-tight">
        Explore Our Latest <span className="text-blue-600 ">Blog Posts</span>
      </h1>

      <div className="w-full bg-card text-foreground max-w-4xl mb-10 p-6 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4  ">
          Filter Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="keyword"
              className="block text-sm font-medium  mb-1"
            >
              Keyword (Title, Content)
            </label>
            <input
              ref={keywordInputRef}
              type="text"
              id="keyword"
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 "
              placeholder="e.g.Naruto"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium mb-1"
            >
              Author
            </label>
            <input
              ref={authorInputRef}
              type="text"
              id="author"
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 "
              placeholder="e.g. John"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        </div>
        <div className="flex justify-center md:justify-end space-x-4 mt-6">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md
                       transition-all duration-300 shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       "
            disabled={loading}
          >
            Search Posts
          </button>
          {(keyword.trim() !== "" || author.trim() !== "") && (
            <button
              onClick={handleClearSearch}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-md
                         transition-all duration-300 shadow-lg hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              disabled={loading}
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {posts.length === 0 && !loading && !initialLoad ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto border border-gray-200">
          <p className="text-gray-600 text-xl mb-4">
            No blog posts published yet.
          </p>
          <p className="text-gray-500 text-md">Post not found!</p>
          
        </div>
      ) : (
        // Display blog post cards in a responsive grid.
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </section>
      )}

      {loading && (
        <div className="mt-8 text-center text-lg text-gray-600 ">
          Loading more posts...
        </div>
      )}

      {!loading && hasMore && posts.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full
                       transition-all duration-300 shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       "
            disabled={loading}
          >
            Load More Posts
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && !loading && (
        <div className="mt-12 text-center text-gray-500">
          You've reached the end of the posts!
        </div>
      )}
    </div>
  );
}
