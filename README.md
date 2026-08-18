# http.meme

A public, embeddable API and web gallery that maps HTTP status codes to meme GIFs (inspired by http.cat). 

🔗 **Live Frontend:** [https://memehttp.netlify.app](https://memehttp.netlify.app)
⚙️ **Live API:** [https://meme-http.onrender.com/404](https://meme-http.onrender.com/404)

![http.meme Frontend](frontend/public/favicon.webp) <!-- Placeholder for actual screenshot -->

## 💡 Intention & Motivation
This project was built with a specific intention: **to master enterprise-level backend engineering concepts while building something genuinely fun.** 

While the premise is simple—serving meme images for HTTP status codes—the underlying architecture was treated like a high-traffic production system. I wanted to move beyond basic CRUD apps and learn how to handle heavy request loads, protect databases from DDoS attacks, and implement complex caching strategies. `http.meme` served as the perfect playground to build a **custom Redis cache**, execute **PostgreSQL atomic updates**, and integrate global **Rate Limiting**.

---

## 🏗️ Detailed Analysis: What Was Built

### System Architecture
```mermaid
graph TD
    subgraph " Architecture "
        D[User Request] --> E[Express Server]
        E -->|1. Check Cache| F[(Redis RAM)]
        F -.->|Cache HIT: 1ms| E
        F -.->|Cache MISS| G[(PostgreSQL HDD)]
        G -.->|Heavy Query: 50ms| E
        E -.->|2. Save result for 60s| F
        E --> D
    end
```

The project is split into a modular **Node/Express Backend** and a **React/Vite Frontend**, deployed entirely on modern serverless/free-tier cloud infrastructure.

### 1. Enterprise Infrastructure (Redis & Postgres)
- **Upstash Serverless Redis:** Implemented a custom Express middleware that intercepts requests. By caching Postgres query results (like `GET /trending`) directly in Redis RAM, API response times dropped from ~50ms to ~1ms, bypassing the database entirely for 99% of requests.
- **Neon.tech Serverless Postgres:** Utilized Prisma ORM to execute single-trip atomic updates (`increment: 1`) every time a meme is fetched, tracking live global trending metrics without race conditions.
- **Token-Bucket Rate Limiting:** Built a global Redis shield (`rate-limiter-flexible`) to track incoming IP addresses. It blocks traffic that exceeds 300 requests per minute with a `429 Too Many Requests` error, mitigating scrapers and automated abuse.

### 2. Scalable Backend Architecture (Node + Express)
- **Model-View-Controller (MVC):** Refactored the backend into a clean, modular pattern separating routes, controllers, and middlewares.
- **True Binary File Serving:** Rather than relying on 302 redirects to external Giphy URLs, the backend streams binary `.webp`/`.gif` files directly from the server disk using `res.sendFile()`, saving massive bandwidth and improving load times.
- **Keep-Alive Pingers:** Implemented a lightweight `/` health-check endpoint to allow UptimeRobot to ping the server every 10 minutes, preventing the Render free tier from spinning down the instance.

### 3. Simple React Frontend
- **API Showcase:** Built a lightweight React frontend (using Vite) solely to showcase and test the API's capabilities in a browser.
- **Click-to-Copy:** Includes a simple utility allowing users to click any meme to instantly copy the HTML `<img>` embed tag to their clipboard.

---

## 🚀 Future Improvements

While the architecture is robust, a high-traffic production environment would require a few evolutions:

1. **Cloud Object Storage (AWS S3):** Currently, the meme images are stored on the local file system. In a distributed environment with multiple server instances, files should be moved to an AWS S3 bucket and served via a CDN (Cloudflare or CloudFront) to reduce server bandwidth.
2. **Automated Testing:** Implement a testing suite using **Jest** and **Supertest** to automate unit tests for the rate limiter and caching middlewares to ensure stability during future refactors.
3. **Dockerization:** Containerize both the Node.js backend and the React frontend using `Dockerfile` and `docker-compose` to ensure the environment is 100% reproducible across any machine.

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Neon.tech)
- Redis Server (Local or Upstash)

### 1. Backend Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/meme_db"
REDIS_URL="redis://localhost:6379"
```

Then run the setup commands:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

### 2. Frontend Setup
Create a `.env` file in the `frontend/` directory (optional):
```env
VITE_API_BASE_URL="http://localhost:3000"
```

Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5174` to view the web application!
