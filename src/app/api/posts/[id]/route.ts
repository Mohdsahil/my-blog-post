import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/data';
import { BlogPost } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedFields: Partial<Omit<BlogPost, 'id' | 'publishedDate' | 'slug'>> = await request.json();

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deletePost(id);

    if (!success) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}