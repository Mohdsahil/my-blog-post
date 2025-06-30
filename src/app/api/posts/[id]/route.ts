import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/data';
import { BlogPost } from '@/lib/types';

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const post = await getPostById(id);

  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  try {
    const updatedFields: Partial<Omit<BlogPost, 'id' | 'publishedDate' | 'slug'>> = await req.json();

    if (Object.keys(updatedFields).length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    const updatedPost = await updatePost(id, updatedFields);

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;
  try {
    const success = await deletePost(id);

    if (!success) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}