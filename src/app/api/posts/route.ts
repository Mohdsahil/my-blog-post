import { NextResponse } from 'next/server';
import { getPosts, createPost, getTotalPostsCount } from '@/lib/data';
import { BlogPost } from '@/lib/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '6', 10);
    const keyword = searchParams.get('keyword') || '';
    const author = searchParams.get('author') || '';

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ message: 'Invalid page number' }, { status: 400 });
    }
    if (isNaN(pageSize) || pageSize < 1) {
      return NextResponse.json({ message: 'Invalid page size' }, { status: 400 });
    }

    const posts = await getPosts(page, pageSize, keyword, author);
    const totalCount = await getTotalPostsCount(keyword, author);

    return NextResponse.json({ posts, totalCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, author, coverImage, content, shortSnippet } = await req.json();

    if (!title || !author || !content) {
      return NextResponse.json({ message: 'Title, author, and content are required' }, { status: 400 });
    }

    const newPost: Omit<BlogPost, 'id' | 'publishedDate' | 'slug'> = {
      title,
      author,
      coverImage,
      content,
      shortSnippet,
    };

    const createdPost = await createPost(newPost);
    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}