import connectDB from "./db";
import mongoose, { Document, Schema, Model } from "mongoose";
import { BlogPost, Comment } from "./types";

// Blog Modal
interface IBlogPost extends BlogPost, Document {}

const BlogPostSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  shortSnippet: { type: String, required: true },
  coverImage: { type: String },
  publishedDate: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
});

function getBlogPostModel(): Model<IBlogPost> {
  if (mongoose.connection && mongoose.connection.models.BlogPost) {
    return mongoose.connection.models.BlogPost as Model<IBlogPost>;
  }

  return mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
}

interface IComment extends Comment, Document {}

const CommentSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  postId: { type: String, required: true, index: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
});

const CommentModel: Model<IComment> = (() => {
  if (mongoose.connection && mongoose.connection.models.Comment) {
    return mongoose.connection.models.Comment as Model<IComment>;
  }
  return mongoose.model<IComment>("Comment", CommentSchema);
})();

export const getPosts = async (
  page: number = 1,
  pageSize: number = 6,
  keyword?: string,
  author?: string
): Promise<BlogPost[]> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();

  const query: any = {};

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    query.$or = [
      { title: { $regex: keywordRegex } },
      { content: { $regex: keywordRegex } },
      { shortSnippet: { $regex: keywordRegex } },
    ];
  }
  if (author) {
    query.author = new RegExp(author, "i");
  }

  const skip = (page - 1) * pageSize;
  const posts = await BlogPostModel.find(query)
    .skip(skip)
    .limit(pageSize)
    .lean();

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.author,
    shortSnippet: post.shortSnippet,
    coverImage: post.coverImage,
    publishedDate: post.publishedDate,
    content: post.content,
    slug: post.slug,
  }));
};

export const getTotalPostsCount = async (keyword?: string, author?: string): Promise<number> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();
  const query: any = {};
  if (keyword) {
    const keywordRegex = new RegExp(keyword, 'i');
    query.$or = [
      { title: { $regex: keywordRegex } },
      { content: { $regex: keywordRegex } },
      { shortSnippet: { $regex: keywordRegex } },
    ];
  }
  if (author) {
    query.author = new RegExp(author, 'i');
  }

  return BlogPostModel.countDocuments(query);
};

export const getPostById = async (
  id: string
): Promise<BlogPost | undefined> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();
  const post = await BlogPostModel.findOne({ id }).lean();
  if (!post) return undefined;
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    shortSnippet: post.shortSnippet,
    coverImage: post.coverImage,
    publishedDate: post.publishedDate,
    content: post.content,
    slug: post.slug,
  };
};

export const getPostBySlug = async (
  slug: string
): Promise<BlogPost | undefined> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();
  const post = await BlogPostModel.findOne({ slug }).lean();
  if (!post) return undefined;
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    shortSnippet: post.shortSnippet,
    coverImage: post.coverImage,
    publishedDate: post.publishedDate,
    content: post.content,
    slug: post.slug,
  };
};

export const createPost = async (
  newPostData: Omit<BlogPost, "id" | "publishedDate" | "slug">
): Promise<BlogPost> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();
  const id = new mongoose.Types.ObjectId().toString();
  const publishedDate = new Date().toISOString().split("T")[0];
  const slug = generateSlug(newPostData.title);

  const postToSave: BlogPost = { id, publishedDate, slug, ...newPostData };
  const createdPost = await BlogPostModel.create(postToSave);

  return {
    id: createdPost.id,
    title: createdPost.title,
    author: createdPost.author,
    shortSnippet: createdPost.shortSnippet,
    coverImage: createdPost.coverImage,
    publishedDate: createdPost.publishedDate,
    content: createdPost.content,
    slug: createdPost.slug,
  };
};

export const updatePost = async (
  id: string,
  updatedFields: Partial<Omit<BlogPost, "id" | "publishedDate" | "slug">>
): Promise<BlogPost | undefined> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();

  const updatePayload: any = { ...updatedFields };
  if (updatedFields.title) {
    updatePayload.slug = generateSlug(updatedFields.title);
  }

  const updatedPost = await BlogPostModel.findOneAndUpdate(
    { id },
    updatePayload,
    { new: true }
  ).lean(); // {new: true} returns the modified document

  if (!updatedPost) return undefined;
  return {
    id: updatedPost.id,
    title: updatedPost.title,
    author: updatedPost.author,
    shortSnippet: updatedPost.shortSnippet,
    coverImage: updatedPost.coverImage,
    publishedDate: updatedPost.publishedDate,
    content: updatedPost.content,
    slug: updatedPost.slug,
  };
};

export const deletePost = async (id: string): Promise<boolean> => {
  await connectDB();
  const BlogPostModel = getBlogPostModel();
  const result = await BlogPostModel.deleteOne({ id });
  return result.deletedCount === 1;
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const getCommentsForPost = async (
  postId: string
): Promise<Comment[]> => {
  await connectDB();
  // Fetch comments for the given postId, sorted by creation date
  const comments = await CommentModel.find({ postId })
    .sort({ createdAt: 1 })
    .lean();
  return comments.map((comment) => ({
    id: comment.id,
    postId: comment.postId,
    author: comment.author,
    content: comment.content,
    createdAt: comment.createdAt,
  }));
};

export const addComment = async (
  commentData: Omit<Comment, "id" | "createdAt">
): Promise<Comment> => {
  await connectDB();
  const id = new mongoose.Types.ObjectId().toString(); // Generate unique ID for comment
  const createdAt = new Date().toISOString(); // Current timestamp

  const commentToSave = { id, createdAt, ...commentData };
  const createdComment = await CommentModel.create(commentToSave);

  return {
    id: createdComment.id,
    postId: createdComment.postId,
    author: createdComment.author,
    content: createdComment.content,
    createdAt: createdComment.createdAt,
  };
};
