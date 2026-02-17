# 🎬 Movie Night

<div align="center">
  <img src="./assets/images/icon.png" width="250" height="250" style="border-radius: 10px;" alt="Movie Night Logo" />
  
  <p align="center">
    <h3>Discover the magic of cinema. Anytime. Anywhere.</h3>
    <a href="https://abdo-omran2206.github.io/Movie-Night/"><strong>🌐 Live Demo</strong></a>
    &nbsp;&nbsp;•&nbsp;&nbsp;
    <a href="https://github.com/Abdo-omran2206/Movie-Night-App"><strong>🖥️ Repository</strong></a>
    &nbsp;&nbsp;•&nbsp;&nbsp;
    <a href="./CONFIGURATION_GUIDE.md"><strong>📚 Configuration Guide</strong></a>
  </p>
</div>

---

## 📝 Description

**Movie Night** is a sleek, premium mobile and web experience that brings the magic of cinema to your fingertips. Built with modern technologies like **React Native**, **Supabase**, and **Zustand**, it offers an intuitive interface for discovering, searching, and exploring movies. Whether you're looking for trending blockbusters, critically acclaimed films, or hidden gems, Movie Night provides comprehensive movie information including cast details, ratings, genres, and plot summaries.

The application features a dark, cinematic theme with smooth animations, offering a "Netflix-inspired" premium feel that is fully optimized for all devices, making it your perfect companion for planning your next movie night.

---

## ✨ Features

### 🏠 **Home Page**

- **Trending Movies**: Large hero cards with backdrop images and movie details
- **Movie Categories**: Top Rated, Popular, Upcoming, and Now Playing sections
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Smooth Animations**: Premium hover effects and transition animations throughout

### 🔍 **Search Functionality**

- **Real-time Search**: Search through thousands of movies and actors instantly
- **Advanced Filtering**: Narrow down results by genre, rating, and date (Powered by TMDB)
- **Instant Results**: Fast API responses with smooth loading states

### 📱 **Immersive Movie Details**

- **Comprehensive Information**: Cast, crew, ratings, genres, and detailed overviews
- **High-Quality Media**: HD backdrop and poster images
- **Integrated Playback**: Watch trailers directly in-app via YouTube integration
- **Similar Content**: Discover related movies and TV shows effortlessly
- **Smart Sharing**: Share movies with customizable templates and deep links

### 👤 **Actor Profiles**

- **Detailed Biographies**: In-depth life and career overviews for cast members
- **Quick Facts**: Birthplace, gender, popularity, and aliases
- **Full Filmography**: Explore an actor's entire career with deep-linked movie profiles
- **Photo Galleries**: Masonry-style image galleries with full-screen viewer

### 🔐 **Advanced Authentication**

- **Secure Flow**: Full account management with Sign-in, Sign-up, and Password recovery
- **Email Verification**: Secure OTP (One-Time Password) verification powered by Supabase Auth
- **Cloud Sync**: Seamlessly sync your bookmarks and preferences across all devices
- **Guest Mode**: Browse without an account, with option to sync later

### ⚙️ **App Configuration & Version Management**

> 📖 **For detailed configuration documentation, see [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md)**

- **Remote Configuration**: Centralized app settings managed via Supabase
- **Dynamic Share Templates**: Customizable share messages for movies and actors with placeholder support
- **Version Control System**:
  - **Force Stop**: Maintenance mode with custom messages (blocks app access)
  - **Required Updates**: Enforce minimum app version with blocking screen
  - **Optional Updates**: Non-intrusive update alerts for latest versions
- **Dynamic URLs**: Configurable base URLs and slugs for movies/actors
- **Update Links**: Direct users to app stores with configurable update URLs


## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Persistent Storage)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (v3 File-based)
- **UI/UX**:
  - `react-native-reanimated` for smooth animations
  - `expo-linear-gradient` for premium aesthetics
  - `react-native-safe-area-context` for responsive layouts
- **Media**: `react-native-youtube-iframe` for video integration
- **API**: [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Network**: `@react-native-community/netinfo` for connectivity monitoring

---

## 🎨 Design System

- **Color Palette**:
  - `Primary`: `#000000` (Deep Cinematic Black)
  - `Accent`: `#E50914` (Classic Cinema Red)
  - `Text`: `#FFFFFF` & `#B3B3B3`
  - `Overlay`: `rgba(0,0,0,0.5)` (Glassmorphism)
- **Typography**:
  - **Headers**: _Bebas Neue_ (Bold, Cinematic)
  - **Body**: _Roboto Slab_ (Modern, Readable)
- **Design Tokens**: Glassmorphism effects, blurred backdrops, and interactive card overlays

---

## 📂 Project Structure

```bash
Movie-Night-App/
├── app/
│   ├── _layout.tsx              # Root layout & auth provider
│   ├── index.tsx                # Main app entry with navigation
│   ├── api/
│   │   ├── main.ts              # TMDB API integration
│   │   ├── supabase.ts          # Supabase client setup
│   │   ├── ConfigManager.ts     # App configuration & version control
│   │   └── BookmarkManager.ts   # Bookmark sync logic
│   ├── components/
│   │   ├── Navbar.tsx           # Bottom navigation
│   │   ├── MovieCard.tsx        # Reusable movie card
│   │   ├── CastCard.tsx         # Actor card component
│   │   └── BookmarkModel.tsx    # Bookmark button
│   ├── pages/
│   │   ├── Home.tsx             # Main discovery feed
│   │   ├── Explore.tsx          # Search & filters
│   │   ├── Bookmark.tsx         # Saved movies
│   │   ├── Profile.tsx          # User account & settings
│   │   ├── moviedetails/        # Movie detail pages
│   │   ├── actordata/           # Actor profile pages
│   │   └── account/             # Auth flows (login, register, OTP)
│   └── store/
│       └── store.ts             # Zustand global state
├── assets/
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App icons & assets
├── CONFIGURATION_GUIDE.md       # Detailed configuration docs
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Supabase account ([sign up here](https://supabase.com))
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone & Install**

   ```bash
   git clone https://github.com/Abdo-omran2206/Movie-Night-App.git
   cd Movie-Night-App
   npm install
   ```

2. **Configure Environment**

   Create a `.env` file in the root directory:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   TMDB_API_KEY=your_tmdb_api_key
   ```


4. **Launch**

   ```bash
   npx expo start
   ```

   Then press:
   - `a` for Android
   - `i` for iOS
   - `w` for Web

---

## 📖 Documentation

- **[Configuration Guide](./CONFIGURATION_GUIDE.md)** - Complete guide for app configuration and version management
- **[Supabase Setup](https://supabase.com/docs)** - Official Supabase documentation
- **[Expo Docs](https://docs.expo.dev/)** - Expo framework documentation
- **[TMDB API](https://developers.themoviedb.org/3)** - The Movie Database API reference

---

## 🔧 Configuration Management

The app supports remote configuration for:

- ✅ Version enforcement (force updates)
- ✅ Maintenance mode
- ✅ Dynamic share messages
- ✅ Configurable URLs and slugs
- ✅ App store update links

See [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) for detailed instructions.

---

## 📈 Versioning

**Current Stable Release**: `2.5.0`

Version management is handled through Supabase configuration:

- `min_app_version`: Minimum required version (blocks older versions)
- `latest_app_version`: Latest available version (shows update alert)
- `force_stop`: Emergency maintenance mode

---

## 🤝 Contributing

This project is currently private. For collaboration inquiries, please contact the team.

---

## 📄 License

This project is private and proprietary.  
© 2026 Movie Night Team. All rights reserved.

---

## 👥 Team

Developed with ❤️ by the Movie Night Team

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the comprehensive movie API
- [Supabase](https://supabase.com/) for backend and authentication services
- [Expo](https://expo.dev/) for the amazing React Native framework
- All open-source contributors whose libraries made this possible
