# 📝 Blogging App

A **full-stack blogging platform** built with **React (Vite)** for the frontend, **Node.js + Express** for the backend, and **PostgreSQL** for persistent data storage.  
Users can **sign up, log in, create blogs, like posts**, and **view blogs** from other users.  

---

## 🚀 Features

- 👤 **User Authentication**
  - Signup & login using JWT-based authentication  
  - Secure cookies for session handling  

- 📰 **Blog Management**
  - Create, read, and delete blogs  
  - Fetch all blogs with aggregated like counts  

- ❤️ **Likes System**
  - Users can like/unlike blogs  
  - Likes tracked in a relational table  

- 🧠 **Smart Architecture**
  - RESTful APIs built with Express  
  - Clean separation of frontend & backend  
  - Middleware-based authentication system  

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React (Vite) + TailwindCSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| State Management | React Context API |
| API Testing | Fetch / Apidog |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/blogging-app.git
cd blogging-app
```
### 2️⃣ Setup backend
```bash
cd backend
npm install
npm run start
```

### 3️⃣ Setup frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4️⃣ Database setup
```sql
CREATE DATABASE <db_name>;
\c <db_name>;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  blog_id INTEGER REFERENCES blogs(id)
);
```

⭐ Future Enhancements
* 🧠 Add Redis caching layer
* 🗂 Pagination and filtering for blogs
* 🖼 Image upload for blogs
* 🛠 Admin dashboard for moderation

