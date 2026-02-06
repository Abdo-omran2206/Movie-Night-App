# Movie Night 🎬

<p align="center">
  <img src="./assets/images/icon.png" width="128" height="128" alt="Movie Night Icon" />
</p>

Welcome to **Movie Night** - your ultimate companion for discovering and tracking movies and TV shows! This modern mobile application is built with React Native and Expo, offering a premium experience for movie enthusiasts.

## 🚀 Features

- 🏠 **Home Feed**: Browse trending movies and TV shows with a sleek, dynamic carousel.
- 🔍 **Explore & Search**: Advanced filtering and search to find exactly what you're looking for.
- 📱 **Immersive Details**: View comprehensive information, including:
  - Cast information & detailed actor profiles.
  - Trailers via integrated YouTube playback.
  - Related content recommendations.
- 🔐 **Secure Authentication**: Full auth flow with Login, Registration, and Email OTP verification powered by Supabase.
- 🔖 **Smart Bookmarks**: Save your favorite content with cloud synchronization.
- 🔄 **Cloud Sync**: Persistent state management ensuring your data is safe across sessions.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) & [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Supabase](https://supabase.com/) (Auth & Database)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based)
- **UI/UX**:
  - `react-native-reanimated` for smooth animations.
  - `expo-linear-gradient` for premium aesthetics.
  - `react-native-safe-area-context` for responsive layouts.
- **Media**: `react-native-youtube-iframe` for video integration.

## 📦 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Ensure you have your Supabase credentials configured in your environment.

3. **Start the app**
   ```bash
   npx expo start
   ```

## 📂 Project Structure

```
app/
├── _layout.tsx          # Root layout & Auth provider
├── index.tsx           # Entry point (Main Tabs)
├── api/               # Supabase client & API handlers
├── components/        # Reusable UI components
├── pages/             # Application screens
│   ├── account/      # Auth flow (Login, Register, Confirm)
│   ├── Home.tsx      # Main Home feed
│   ├── Explore.tsx   # Discovery section
│   └── Profile.tsx   # User settings & cloud sync
└── store/             # Zustand state management
```

## 📈 Version

Current version: **2.0.0**

## 📄 License

This project is private and proprietary.
