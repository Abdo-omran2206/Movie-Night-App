# 🎬 Movie Night

<div align="center">
  <img src="./assets/images/icon.png" width="250" height="250" style="border-radius: 10px;" alt="Movie Night Logo" />
  
  <p align="center">
    <h3>Discover the magic of cinema. Anytime. Anywhere.</h3>
    <a href="https://movie-night-self.vercel.app/"><strong>🌐 Live Demo</strong></a>
    &nbsp;&nbsp;•&nbsp;&nbsp;
    <a href="https://github.com/Abdo-omran2206/Movie-Night"><strong>🖥️ Repository</strong></a>
  </p>
</div>

---

## 📝 Description

**Movie Night** is a sleek, premium mobile and web experience that brings the magic of cinema to your fingertips. Built with modern technologies like **React Native**, **Supabase**, and **Zustand**, it offers an intuitive interface for discovering, searching, and exploring **movies and TV shows**. Whether you're looking for trending blockbusters, binge-worthy series, or hidden gems, Movie Night provides comprehensive information including cast details, ratings, genres, and plot summaries.

The application features a dark, cinematic theme with smooth animations, offering a "Netflix-inspired" premium feel that is fully optimized for all devices, making it your perfect companion for planning your next movie night.

---

## ✨ Features

### 🏠 **Home Page**

- **Trending Movies**: Immersive hero cards with **Parallax Scrolling** effects via `react-native-reanimated`
- **Movie Categories**: Top Rated, Popular, Upcoming, and Now Playing sections with parallel loading
- **Localized Content**: Automatically dynamically detects user's region via IP and centralizes mappings in `constant/main.ts`
- **Responsive Design**: Optimized for mobile, tablet, and desktop types with dynamic safe-area insets
- **Skeleton Loading**: High-premium, pulse-animated placeholders for all movie lists and hero cards
- **Floating Navbar**: A modern, glassmorphism-style floating capsule navigation bar with **Haptic Feedback** integration

### 🔍 **Search Functionality**

- **Real-time Search**: Search through thousands of movies and actors instantly
- **Advanced Filtering**: Narrow down results by genre, rating, and date (Powered by TMDB)
- **Instant Results**: Fast API responses with pulse-animated skeleton loading

### 📱 **Immersive Movie & TV Details**

- **Comprehensive Information**: Cast, crew, ratings, genres, seasons, and detailed overviews
- **High-Quality Media**: HD backdrop and poster images
- **User Reviews**: Access detailed user reviews and ratings for movies and TV shows
- **Streaming Providers**: Browse and discover content available on specific streaming services
- **Integrated Playback**: Watch trailers directly in-app via YouTube integration
- **Similar & Recommended Content**: Discover related movies and TV shows effortlessly with integrated recommendations
- **Smart Sharing**: Share movies, TV shows, and seasons with customizable templates and deep links

### 📚 **Bookmarks & Library**

- **Unified Library**: Save movies and TV shows with statuses like _Watching_, _Watch Later_, _Completed_, and _Dropped_
- **Guest Mode Storage**: Local SQLite-based bookmarks when browsing without an account
- **Account Mode Storage**: Cloud bookmarks stored in Supabase for cross-device sync
- **Seamless Migration**: Guest bookmarks automatically sync to the cloud after login or registration

### 👤 **Actor Profiles**

- **Detailed Biographies**: In-depth life and career overviews for cast members
- **Quick Facts**: Birthplace, gender, popularity, and aliases
- **Full Filmography**: Explore an actor's entire career with deep-linked movie profiles
- **Photo Galleries**: Masonry-style image galleries with full-screen viewer

### 🔐 **Advanced Authentication**

- **Secure Flow**: Full account management with Sign-in, Sign-up, and Password recovery
- **Email Verification**: Secure OTP (One-Time Password) verification powered by Supabase Auth
- **Password Reset**: Two-step recovery flow using Supabase OTP (reset email + in-app token & new password)
- **Cloud Sync**: Seamlessly sync your bookmarks and preferences across all devices
- **Guest Mode**: Browse without an account, with option to sync later

### ⚙️ **App Configuration & Version Management**

- **Remote Configuration**: Centralized app settings managed via Supabase
- **Dynamic Share Templates**: Customizable share messages for movies, TV shows, and actors with placeholder support
- **Version Control System**:
  - **Force Stop**: Maintenance mode with custom messages (blocks app access)
  - **Required Updates**: Enforce minimum app version with blocking screen
  - **Optional Updates**: Non-intrusive update alerts for latest versions
- **Dynamic URLs**: Configurable base URLs and slugs for movies/actors
- **Update Links**: Direct users to app stores with configurable update URLs

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing with centralized interfaces)
- **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Persistent Storage)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (v3 File-based)
- **UI/Animations**:
  - `react-native-reanimated` for smooth parallax and content animations
  - `expo-haptics` for premium tactile feedback on interactions
  - `Skeleton Loading`: Custom pulse-animated placeholders for enhanced UX
  - `expo-linear-gradient` for premium aesthetics
  - `react-native-safe-area-context` for responsive, Notch-aware layouts
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
│   ├── _layout.tsx              # Root layout & navigation shell
│   ├── index.tsx                # Tab layout and entry screen
│   ├── api/
│   │   ├── main.ts              # TMDB API integration helpers
│   │   ├── supabase.ts          # Supabase client setup
│   │   ├── ConfigManager.ts     # Remote config & version enforcement
│   │   ├── BookmarkManager.ts   # Unified guest/account bookmark facade
│   │   ├── OnlineMood.ts        # Cloud (Supabase) bookmark implementation
│   │   └── GustMood.ts          # Guest (SQLite) bookmark implementation
│   ├── constant/
│   │   ├── main.ts              # Global constants (regions, default sections)
│   │   └── interfaces.ts        # Centralized TypeScript types & interfaces
│   ├── components/
│   │   ├── Navbar.tsx           # Bottom navigation bar
│   │   ├── Banner.tsx           # Home trending hero carousel
│   │   ├── section.tsx          # Horizontal content rails (home)
│   │   ├── ExploreCard.tsx      # Card for Explore grid results
│   │   ├── Skeleton.tsx         # Pulse loading skeletons
│   │   ├── ShowTrailer.tsx      # YouTube trailer modal
│   │   ├── StreamModel.tsx      # Watch Now / streaming modal
│   │   ├── ImageViewer.tsx      # Full-screen image viewer
│   │   ├── BookmarkModel.tsx    # Bookmark button & status selector
│   │   └── Cards/
│   │       ├── BookmarkCard.tsx # Card for bookmark list
│   │       ├── CastCard.tsx     # Actor/cast avatar card
│   │       ├── MovieCard.tsx    # Reusable card for movies/TV
│   │       ├── ProvidersCards.tsx # Card for streaming providers
│   │       └── TvSeasonCard.tsx # Card for individual TV seasons
│   ├── lib/
│   │   ├── generateMovieAvatar.ts # Fallback avatar SVG generator
│   │   ├── getRegion.ts         # IP-based region detection
│   │   ├── hash.ts              # Hashing utilities
│   │   └── slugify.ts           # String slugification utilities
│   ├── pages/
│   │   ├── Home.tsx             # Main discovery feed (trending & rails)
│   │   ├── Explore.tsx          # Search & filters (movies/TV)
│   │   ├── Bookmark.tsx         # Saved library (guest & account)
│   │   ├── Profile.tsx          # User account & settings
│   │   ├── Provider/
│   │   │   ├── Providers.tsx    # List of streaming providers
│   │   │   └── [ProviderId].tsx # Movies/TV by provider
│   │   ├── reviews/
│   │   │   └── [movieID].tsx    # User reviews for movies/TV
│   │   ├── moviedetails/
│   │   │   └── [movieID].tsx    # Movie details screen
│   │   ├── tvdetails/
│   │   │   ├── [tvID].tsx       # TV show details screen
│   │   │   └── season/
│   │   │       └── [...slug].tsx # TV season details screen
│   │   ├── actordata/
│   │   │   ├── [actorID].tsx    # Actor profile details
│   │   │   └── Filmography.tsx  # Actor filmography grid
│   │   ├── player/
│   │   │   └── [player].tsx     # Embedded WebView player
│   │   └── account/
│   │       ├── login.tsx        # Login screen
│   │       ├── register.tsx     # Registration screen
│   │       ├── confirm.tsx      # Email OTP confirmation
│   │       └── resetPassword.tsx # Password reset (OTP + new password)
│   └── store/
│       └── store.ts             # Zustand global state & config
├── assets/
│   ├── fonts/                   # Custom fonts
│   └── images/                  # App icons & artwork
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

3. **Launch**

   ```bash
   npx expo start
   ```

   Then press:
   - `a` for Android
   - `i` for iOS
   - `w` for Web

---

## 📖 Documentation

- **Product Requirements**: see `prd.md` for detailed product and feature specifications
- **[Supabase Setup](https://supabase.com/docs)** - Official Supabase documentation
- **[Expo Docs](https://docs.expo.dev/)** - Expo framework documentation
- **[TMDB API](https://developers.themoviedb.org/3)** - The Movie Database API reference

---

## 🔧 Configuration Management

The app supports remote configuration for:

- ✅ Version enforcement (force updates)
- ✅ Maintenance mode
- ✅ Dynamic share messages for movies, TV shows, seasons, and actors
- ✅ Configurable URLs and slugs (movie, TV, actor, base URL)
- ✅ App store update links

Configuration is stored in the Supabase `app_config` table and consumed via the in-app `ConfigManager` and global store.

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
