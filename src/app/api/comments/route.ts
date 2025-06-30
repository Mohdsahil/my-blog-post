import { NextResponse } from 'next/server';
import { getCommentsForPost, addComment } from '@/lib/data';
import { Comment } from '@/lib/types';


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'postId query parameter is required' }, { status: 400 });
    }

    const comments = await getCommentsForPost(postId);
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { postId, author, content } = await req.json();

    if (!postId || !author || !content) {
      return NextResponse.json({ message: 'postId, author, and content are required' }, { status: 400 });
    }

    const newCommentData: Omit<Comment, 'id' | 'createdAt'> = {
      postId,
      author,
      content,
    };

    const createdComment = await addComment(newCommentData);
    return NextResponse.json(createdComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
