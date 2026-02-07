# 🎬 Movie Night

<div align="center">
  <img src="./assets/images/icon.png" width="250" height="250" style="border-radius: 10px;" alt="Movie Night Logo" />
  
  <p align="center">
    <h3>Discover the magic of cinema. Anytime. Anywhere.</h3>
    <a href="https://abdo-omran2206.github.io/Movie-Night/"><strong>🌐 Live Demo</strong></a>
    &nbsp;&nbsp;•&nbsp;&nbsp;
    <a href="https://github.com/Abdo-omran2206/Movie-Night-App"><strong>🖥️ Repository</strong></a>
  </p>
</div>

---

## 📝 Description

**Movie Night** is a sleek, premium mobile and web experience that brings the magic of cinema to your fingertips. Built with modern technologies like **React Native**, **Supabase**, and **Zustand**, it offers an intuitive interface for discovering, searching, and exploring movies. Whether you're looking for trending blockbusters, critically acclaimed films, or hidden gems, Movie Night provides comprehensive movie information including cast details, ratings, genres, and plot summaries.

The application features a dark, cinematic theme with smooth animations, offering a "Netflix-inspired" premium feel that is fully optimized for all devices, making it your perfect companion for planning your next movie night.

---

## ✨ Features

### 🏠 **Home Page**

- **Trending Movies**: Large hero cards with backdrop images and movie details.
- **Movie Categories**: Top Rated, Popular, Upcoming, and Now Playing sections.
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices.
- **Smooth Animations**: Premium hover effects and transition animations throughout.

### 🔍 **Search Functionality**

- **Real-time Search**: Search through thousands of movies and actors instantly.
- **Advanced Filtering**: Narrow down results by genre, rating, and date (Powered by TMDB).
- **Instant Results**: Fast API responses with smooth loading states.

### 📱 **Immersive Movie Details**

- **Comprehensive Information**: Cast, crew, ratings, genres, and detailed overviews.
- **High-Quality Media**: HD backdrop and poster images.
- **Integrated Playback**: Watch trailers directly in-app via YouTube integration.
- **Similar Content**: Discover related movies and TV shows effortlessly.

### 👤 **Actor Profiles**

- **Detailed Biographies**: In-depth life and career overviews for cast members.
- **Quick Facts**: Birthplace, gender, popularity, and aliases.
- **Full Filmography**: Explore an actor's entire career with deep-linked movie profiles.

### 🔐 **Advanced Authentication**

- **Secure Flow**: Full account management with Sign-in, Sign-up, and Password recovery.
- **Email Verification**: Secure OTP (One-Time Password) verification powered by Supabase Auth.
- **Cloud Sync**: Seamlessly sync your bookmarks and preferences across all devices.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Persistent Storage)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (v3 File-based)
- **UI/UX**:
  - `react-native-reanimated` for smooth animations.
  - `expo-linear-gradient` for premium aesthetics.
  - `react-native-safe-area-context` for responsive layouts.
- **Media**: `react-native-youtube-iframe` for video integration.
- **API**: [The Movie Database (TMDB)](https://www.themoviedb.org/)

---

## 🎨 Design System

- **Color Palette**:
  - `Primary`: `#000000` (Deep Cinematic Black)
  - `Accent`: `#E50914` (Classic Cinema Red)
  - `Text`: `#FFFFFF` & `#B3B3B3`
- **Typography**:
  - **Headers**: _Bebas Neue_ (Bold, Cinematic)
  - **Body**: _Roboto Slab_ (Modern, Readable)
- **Design Tokens**: Glassmorphism effects, blurred backdrops, and interactive card overlays.

---

## 📂 Project Structure

```bash
app/
├── _layout.tsx          # Main entry & Auth provider
├── index.tsx           # Home feed & Tab navigation
├── api/               # Supabase & TMDB API handlers
├── components/        # Reusable UI elements (Buttons, Cards)
├── pages/             # Main Screens
│   ├── account/      # Auth flow (Login, OTP, Register)
│   ├── Home.tsx      # Main discovery board
│   ├── Explore.tsx   # Advanced search & filters
│   └── Profile.tsx   # User settings & sync
└── store/             # Zustand persistent storage
```

---

## 🚀 Getting Started

1. **Clone & Install**

   ```bash
   git clone https://github.com/Abdo-omran2206/Movie-Night-App.git
   cd Movie-Night-App
   npm install
   ```

2. **Configure Environment**
   Set up your `.env` with `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

3. **Launch**
   ```bash
   npx expo start
   ```

---

## 📈 Versioning

Current Stable Release: **2.1.0**

## 🤝 License

This project is private and proprietary. © 2026 Movie Night Team.
