<div align="center">

<img src="Frontend/src/assets/images/logo.png" alt="Moodify Logo" width="80" height="80" />

# 🎵 Moodify

### AI-Powered Emotion-Based Music Player

*Your mood. Your music. Automatically.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-moodify--io.vercel.app-8b5cf6?style=for-the-badge&logo=vercel)](https://moodify-io.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-SahilShaikh--Developer-181717?style=for-the-badge&logo=github)](https://github.com/SahilShaikh-Developer/Moodify)
[![License](https://img.shields.io/badge/License-MIT-ec4899?style=for-the-badge)](LICENSE)





</div>

---

## 📖 About

**Moodify** is a full-stack web application that uses **AI-powered facial recognition** to detect your emotional state in real-time and automatically plays music that matches your mood. Simply look at your webcam, let Moodify analyze your facial expressions, and enjoy a personalized music experience tailored to how you feel.

> *"Music is the shorthand of emotion."* — Leo Tolstoy

---

## ✨ Features

- 🤖 **AI Emotion Detection** — Real-time facial expression analysis using MediaPipe FaceLandmarker
- 🎵 **Mood-Based Music** — Automatically plays songs matching your detected emotion
- 😄 **4 Emotion Modes** — Happy, Sad, Angry, and Surprise
- ❤️ **Favourites** — Save and filter your favourite songs
- ⏭️ **Smart Playlist** — Skip next/previous, auto-play next song
- 🌙 **Dark/Light Mode** — Full theme support
- 🔐 **Google OAuth** — Sign in with Google
- 📱 **Mobile Responsive** — Works on all screen sizes
- ☁️ **Cloud Storage** — Songs and covers stored on ImageKit CDN
- 🔒 **Secure Auth** — JWT + Redis token blacklisting

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite | UI Framework |
| MediaPipe FaceLandmarker | AI Face Detection |
| Zustand | State Management |
| Framer Motion | Animations |
| React Router | Navigation |
| SCSS | Styling |
| Axios | HTTP Client |
| @react-oauth/google | Google Authentication |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | Server Framework |
| MongoDB + Mongoose | Database |
| Redis (Upstash) | Token Blacklisting |
| JWT + bcrypt | Authentication |
| ImageKit | Audio/Image CDN |
| Multer | File Upload |
| node-id3 | MP3 Metadata |
| music-metadata | Audio Duration |

---

## 🚀 Live Demo

🌐 **Frontend:** [https://moodify-io.vercel.app](https://moodify-io.vercel.app)

🔧 **Backend API:** [https://moodify-backend-dcj2.onrender.com](https://moodify-backend-dcj2.onrender.com)





---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Redis (Upstash) account
- ImageKit account
- Google Cloud Console account

### 1. Clone the Repository

```bash
git clone https://github.com/SahilShaikh-Developer/Moodify.git
cd Moodify
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file in `Backend/` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=your_upstash_redis_url
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/yourid
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start Backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env` file in `Frontend/` folder:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start Frontend:
```bash
npm run dev
```

### 4. Open in Browser

```
http://localhost:5173
```

---

## 🎮 How to Use

1. **Register/Login** — Create an account or sign in with Google
2. **Upload Songs** — Add MP3 songs with mood tags (Happy/Sad/Angry/Surprise)
3. **Detect Emotion** — Click "Detect Expression" to start webcam
4. **Capture Mood** — Look at camera, let AI detect your emotion
5. **Enjoy Music** — Songs matching your mood play automatically!
6. **Favourite Songs** — Heart your favourite tracks
7. **Skip Songs** — Use ⏮️ ⏭️ to navigate playlist

---

## 📁 Project Structure

```
Moodify/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & Redis config
│   │   ├── controllers/     # Auth & Song controllers
│   │   ├── middlewares/     # Auth & Upload middlewares
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── services/        # ImageKit storage service
│   ├── server.js
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── assets/          # Images & fonts
    │   ├── features/
    │   │   ├── auth/        # Login, Register, Auth store
    │   │   └── Expression/  # Face detection, Music player
    │   ├── styles/          # SCSS stylesheets
    │   └── lib/             # Axios instance
    ├── index.html
    └── package.json
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/get-me` | Get current user |
| POST | `/api/auth/google` | Google OAuth |

### Song Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/song` | Upload new song |
| GET | `/api/song` | Get songs by mood |
| DELETE | `/api/song/:id` | Delete song |
| PATCH | `/api/song/:id/favourite` | Toggle favourite |

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Cache | Upstash Redis |
| CDN | ImageKit |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Developer

**Sahil Shaikh**

[![GitHub](https://img.shields.io/badge/GitHub-SahilShaikh--Developer-181717?style=flat&logo=github)](https://github.com/SahilShaikh-Developer)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ and 🎵 by **Sahil Shaikh**

⭐ Star this repo if you liked it!

</div>
