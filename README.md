Blog Platform with Dynamic Custom Blocks and Themes
This is a full-featured blogging platform built with Next.js (App Router), React, and Tailwind CSS. It allows users to create, read, and manage blog posts, featuring dynamic {{block ...}} tags, a comment system, pagination, search/filter capabilities, and theme switching.

Features
Home Page (/): Displays a list of blog posts with "Load More" pagination, and robust search/filter options by keyword and author.

Post Detail Page (/posts/[slug]): Shows the full blog content, dynamically parsing and rendering {{block ...}} tags into custom React components. Includes a comment section.

Create Blog Page (/create): Client-side form for creating new blog posts using a TinyMCE rich text editor.

Edit Blog Page (/edit/[id]): Client-side form for editing existing blog posts, also using TinyMCE.

Comment System: Allows users to add comments to each blog post. Comments are persisted in MongoDB.

API Routes (/api/posts, /api/posts/[id], /api/comments): RESTful API endpoints for comprehensive CRUD (Create, Read, Update, Delete) operations on blog posts and comments.

Dynamic Custom Blocks: Content can include {{block name="..." attribute="..."}} tags, which are parsed using regex and replaced with interactive React components (e.g., product lists, image showcases).

SEO-Friendly Slugs: Blog posts use human-readable slugs in their URLs (e.g., /posts/my-awesome-blog-post).

Theme Switching: Supports light and dark modes, with user preference persisted in local storage and respecting system preference on first load.

Toast Notifications: Provides user feedback for various actions using react-hot-toast.

Tech Stack
Framework: Next.js 15+ (App Router)

Language: TypeScript

Styling: Tailwind CSS v4 (Utility-first CSS framework)

@tailwindcss/postcss for v4 integration.

darkMode: 'class' for theme switching.

Database: MongoDB (persisted via mongoose)

ORM: Mongoose

Rendering: Client Components for interactive pages (/, /create, /edit/[id]), Server Components for data fetching and initial rendering on server.

Rich Text Editor: TinyMCE (with dynamic theme support)

UI Components: Custom-built components with Tailwind CSS.

Notifications: react-hot-toast

Setup Instructions
Follow these steps to get the project up and running on your local machine.

1. Prerequisites
Node.js (v18.x or later, highly recommended to use a Node Version Manager like nvm or fnm for managing Node.js versions safely)

npm (comes with Node.js) or Yarn

A MongoDB instance (local or cloud-hosted like MongoDB Atlas).

2. Clone the Repository (Simulated)
Assuming you've created your Next.js project and are adding these files. If you already have a project, simply navigate to its root.

cd my-project

3. Install Dependencies
Ensure your package.json includes all necessary dependencies (as shown in earlier prompts). Then run:

npm install
# or
yarn install

(Ensure react-hot-toast and @tinymce/tinymce-react are installed manually if your initial setup didn't include them.)

4. Environment Variables
Create a file named .env.local at the root of your project (same level as package.json). Add your MongoDB connection URI and TinyMCE API key:

# .env.local

MONGODB_URI="mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database_name>?retryWrites=true&w=majority"
NEXT_PUBLIC_TINYMCE_API_KEY="YOUR_TINY_MCE_API_KEY_HERE"

Replace placeholders with your actual MongoDB Atlas (or local MongoDB) connection string.

Replace YOUR_TINY_MCE_API_KEY_HERE with your actual API key from TinyMCE Cloud.

Security Note: Do NOT commit .env.local to version control (Git). It's typically ignored by default in Next.js projects.