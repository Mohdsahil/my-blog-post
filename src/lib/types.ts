export interface BlogPost {
  id: string;
  title: string;
  author: string;
  shortSnippet: string; 
  coverImage?: string;
  publishedDate: string; 
  content: string; // Full blog content, with {{block}} tags
  slug: string;
}

export interface CustomBlock {
  name: string;
  image?: string;
  products?: string[]; // Array of SKUs
}

export interface Comment {
  id: string; 
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}
