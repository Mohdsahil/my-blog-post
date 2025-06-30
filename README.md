# 📝 Next.js Blog Platform with Dynamic Features & Themes

This **Next.js blog platform** offers a full-featured blogging experience with dynamic content rendering, theme customization, and modern tech integration like React, Tailwind CSS, and MongoDB.

---

## 🚀 Features

- **Home Page (`/`)**  
  Paginated blog posts with "Load More", search, and filter by keyword and author.

- **Post Detail Page (`/posts/[slug]`)**  
  Displays full blog content and dynamically renders `{{block ...}}` tags into custom React components. Includes a comment section.

- **Create/Edit Pages (`/create`, `/edit/[id]`)**  
  Client-side forms with rich text editing via TinyMCE.

- **Comment System**  
  Users can add and view comments; stored in MongoDB.

- **API Routes**  
  RESTful endpoints:  
  - `/api/posts`  
  - `/api/posts/[id]`  
  - `/api/comments`

- **Dynamic Custom Blocks**  
  Custom `{{block ...}}` tags render interactive UI (e.g., product lists, image showcases).

- **SEO-Friendly Slugs**  
  Human-readable URLs for each post.

- **Theme Switching**  
  Light and dark modes with local storage and system preference support.

- **Toast Notifications**  
  User feedback using `react-hot-toast`.

---

## 🛠 Tech Stack

| Tool | Usage |
|------|-------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`, `darkMode: 'class'`) |
| **Database** | MongoDB (via Mongoose) |
| **Rendering** | Client + Server Components |
| **Editor** | TinyMCE (theme-adaptive) |
| **UI** | Custom Tailwind-styled components |
| **Notifications** | `react-hot-toast` |

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js v18+ (use `nvm` or `fnm` recommended)
- npm or Yarn
- MongoDB (local or cloud instance)

---

### 2. Get the Project

```bash
cd my-blog-post
```

---

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 4. Environment Variables

Create `.env.local` at the root:

```env
# .env.local
MONGODB_URI="mongodb+srv://<your_username>:<your_password>@<your_cluster_url>/<your_database_name>?retryWrites=true&w=majority"
TINYMCE_API_KEY="YOUR_TINY_MCE_API_KEY_HERE"
```

> 🔒 **Do not commit `.env.local`**

---

### 5. Configure Tailwind CSS

Ensure your `tailwind.config.ts` looks like:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

---

### 6. Update Global Styles

Update `src/styles/globals.css`:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

html.dark {
  color-scheme: dark;
  --background: #0a0a0a;
  --foreground: #ededed;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

### 7. Update Source Files

Ensure all `src/` directory files are updated with the latest components, routes, API handlers, models (e.g., `models/Comment.ts`), etc.

---

### 8. Add Public Images

Place required images in the `public/` folder:

```
/public/
  ├── keyboard.png
  ├── mouse.png
  ├── monitor.png
  └── top-products.png
```

---

### 9. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

### 10. (Optional) Seed Initial Data

Trigger the `seedInitialData()` function manually via a temporary API route or server script to populate demo posts.

---

## 🌐 Live Demo

Visit: [https://my-blog-post-three.vercel.app](https://my-blog-post-three.vercel.app)

---

## 📄 License

MIT – use freely and modify as needed.
