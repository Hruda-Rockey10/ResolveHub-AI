# ResolveHub AI

**House of EdTech - Fullstack Developer Assignment**  
**Author:** Hrudananda Behera

ResolveHub AI is a sophisticated, full-stack Q&A platform built with Next.js 16. It empowers users to ask technical questions, provide answers, and leverage AI capabilities to streamline the question-resolution process. 

This project goes beyond basic CRUD operations by incorporating thoughtful business logic, state transitions (UNRESOLVED → IN_PROGRESS → RESOLVED), robust security, and seamless AI integrations to deliver a scalable, impactful user experience.

---

## 🚀 Live Demo
- **Live Deployment:** *(Add your Vercel link here later)*
- **GitHub Repository:** [https://github.com/Hruda-Rockey10/ResolveHub-AI](https://github.com/Hruda-Rockey10/ResolveHub-AI)

---

## ✨ Key Features & Functionality

### 1. Robust Full-Stack Architecture
- Built with **Next.js 16** (App Router) for high-performance server-side rendering (SSR), optimized data fetching, and seamless API routing.
- **TypeScript** integration ensures strict type safety and long-term code maintainability.

### 2. Intelligent AI Integration (OpenRouter)
- **AI Tag & Difficulty Suggestion:** Uses `meta-llama/llama-3.3-70b-instruct` (via OpenRouter) to automatically analyze question content and suggest appropriate tags and difficulty levels.
- **AI Draft Answers:** Generates high-quality, concise draft answers to questions with a single click, which users can edit before posting.

### 3. Comprehensive CRUD & State Management
- Full Create, Read, Update, and Delete capabilities for Questions and Answers.
- **Workflow State Engine:** Questions automatically transition statuses based on business logic:
  - `UNRESOLVED`: 0 answers.
  - `IN_PROGRESS`: Has answers, but none accepted.
  - `RESOLVED`: Author has accepted an answer.
- Search and status filtering logic processed client-side with React `useMemo` for optimal UX performance.

### 4. Security & Authentication
- Secure, custom-built authentication system utilizing **JWT (Jose)** and HttpOnly cookies to mitigate XSS attacks.
- Passwords strongly hashed using **bcryptjs**.
- Granular authorization: Only the author of a question can edit, delete, or accept an answer for it. Middleware protects private routes natively.

### 5. Polished User Interface
- Clean, responsive design built with **Tailwind CSS**.
- Dynamic navigation bar and custom UI components ensuring accessibility and modern aesthetics.
- Footer includes developer metrics (Name, GitHub, LinkedIn) per assignment requirements.

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Core Framework** | Next.js 16, React 19, TypeScript |
| **Database & ORM** | PostgreSQL (Neon DB), Prisma ORM |
| **Styling** | Tailwind CSS v4 |
| **Authentication** | JWT (Jose), bcryptjs, Next.js Middleware |
| **AI Integration** | OpenRouter (`openai` SDK interface) |
| **Validation** | Zod (End-to-end schema validation) |
| **Testing** | Jest, ts-jest |

---

## 🧪 Testing Strategy

The application employs automated testing alongside manual end-to-end flow verification to ensure maximum reliability.

### Automated Tests (Jest)
Run the test suite using `npm test`. The automated tests cover:
- Detailed schema validation logic for Questions and Answers.
- Core business logic transitions mapping the Question resolution lifecycle.

### Manual End-to-End Validation
- Registration and secure Login flows.
- JWT Cookie-based Protected Route access.
- Question/Answer CRUD operability.
- AI suggestion and generation accuracy.
- Database cascading deletion logic verification.

---

## 🛡️ Production & Scalability Considerations

- **Security Mitigation:** Server Actions and API routes implement rigorous `zod` input validation before touching the database. HttpOnly cookies prevent token leakage.
- **Performance:** Leveraging SSR ensures fast Initial Page Loads. The Question Feed filters locally to prevent database hammering on search queries.
- **Scalability:** Prisma connection pooling is enabled to handle concurrent PostgreSQL connection requests efficiently. The stateless JWT architecture ensures seamless horizontal scaling.

---

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hruda-Rockey10/ResolveHub-AI.git
   cd resolvehub-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<your-neon-url>/neondb?sslmode=require&channel_binding=require"
   JWT_SECRET="your_secure_random_string_here"
   OPENROUTER_API_KEY="your_openrouter_api_key"
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment (Vercel)

The app is fully optimized for Vercel deployment:
1. Connect the GitHub repository to a new Vercel project.
2. Add the three environment variables (`DATABASE_URL`, `JWT_SECRET`, `OPENROUTER_API_KEY`) to the Vercel project settings.
3. The build command `prisma generate && next build` is already configured in `package.json`.
4. Click Deploy.

---
*Developed for House of EdTech Assignment - Dec 2025*
