## Product Requirements Document (PRD) — Movie Night

### Overview

**Movie Night** is a premium-feeling mobile + web app for discovering movies/TV shows, exploring detailed metadata (cast, genres, ratings), watching trailers, and saving items to a personal bookmark library. It supports **Guest mode** (local SQLite bookmarks) and **Account mode** (Supabase Auth + cloud-synced bookmarks), with **remote configuration** for maintenance mode and version enforcement.

### Goals

- **Discovery-first experience**: help users quickly find something to watch, powered by region-based localization.
- **Deep exploration**: rich details pages for movies, TV, and actors (cast, reviews, similar/recommendations, photos, streaming providers).
- **Personal library**: simple bookmarking with watch-status tracking.
- **Cross-device continuity**: optional login that syncs guest bookmarks to the cloud.
- **Operational control**: remotely block app (maintenance) or enforce updates by version.

### Non-goals (current scope)

- Subscription and payment management for external streaming providers.
- Social features (friends, shared lists, comments, ratings by users).
- Fully native playback: the “Watch Now” experience uses a WebView embed.

### Target users & personas

- **Casual Browser**: wants trending/popular picks fast without signing up.
- **Planner**: saves items into “Watch Later” and tracks status over time.
- **Movie Nerd**: dives into cast/filmography, recommendations, trailers, and actor photos.

### Platforms

- **Mobile**: Expo + React Native (Android/iOS).
- **Web**: Expo web build (static output).

### Key user journeys

1. **Guest discovery**
   - Launch app → Home feed (Trending + category rails) → open details → watch trailer → bookmark (stored locally).
2. **Explore & filter**
   - Explore tab → search (debounced) or open filter modal → browse results grid → open details.
3. **Account onboarding**
   - Profile tab (guest) → register → email OTP confirm → becomes “Account mode”.
4. **Bookmark sync**
   - User registers/logs in after bookmarking as guest → guest bookmarks **sync to Supabase** → guest DB cleared.
5. **Operational guardrails**
   - App starts → fetch remote config → may show maintenance/update-required block screen, or optional update alert.

### Product requirements

#### Home (Discovery feed)

- **Trending hero carousel** for weekly trending movies with **Parallax scrolling** effect.
- **Category rails**: Top Rated, Popular, Upcoming, Now Playing.
- **Localized Content**: Resolves user region dynamically via IP to display region-specific trending content.
- **Loading UX**: skeleton placeholders for hero and lists.
- **Offline UX**: initial screen shows “No Internet Connection” if disconnected.
- **Centralized Mapping**: Uses centralized regions mapping for consistent naming across Home and Profile.

#### Explore (Search + filters)

- **Unified search bar** (debounced; triggers when query length > 2).
- **Filters modal** supporting:
  - **Type**: movie / tv
  - **Status/category**: popular / top_rated / upcoming / now_playing
  - **Country/Region** (also drives default language mapping)
  - **Genres** (multi-select; fixed list)
  - **Year** (2000–current; optional)
- **Infinite scrolling**:
  - Explore results paginate via TMDB discover with `page`.
  - Search results paginate via TMDB search with `page`.
- **Result cards** open correct details page:
  - Movie → `moviedetails/[movieID]`
  - TV → `tvdetails/[tvID]`

#### Movie details

- Fetches movie details with **credits + similar + videos + recommendations**.
- Shows:
  - Backdrop/poster, title, overview, genres, release date, runtime, rating.
  - **Cast carousel** and **similar/recommendations rails**.
  - **Trailer modal** (YouTube) when available.
  - **Reviews**: Dedicated page to read user reviews and ratings (`pages/reviews/[movieID]`).
  - **Share** using a remote-configurable template:
    - Template placeholders: `{title}`, `{url}`
    - URL built from `base_url` + `movie_slug` + ID (defaults if missing)
- **Bookmark button** with status selection:
  - Watching / Watch Later / Completed / Dropped
  - Can update status or remove bookmark.
- **Watch Now** navigates to player screen.

#### TV details

- Fetches TV details with **credits + videos + similar**.
- Shows:
  - Backdrop/poster, title, overview, genres, first air date, seasons, rating.
  - Cast carousel and similar rail.
  - Trailer modal (YouTube) when available.
  - **Reviews**: Dedicated page to read user reviews and ratings.
- Share button uses a **remote-configurable TV share template**:
  - Template placeholders: `{title}`, `{url}`
  - URL built from `base_url` + `tv_slug` + ID (defaults if missing).
- Bookmark button supports TV items.

#### TV season details

- Dedicated **Season details** screen per TV show and season:
  - Route: `tvdetails/season/[...slug]` where slug = `[tvID, seasonNumber]`.
  - Fetches per-season metadata, episodes, and videos via TMDB.
- Shows:
  - Backdrop/poster (from series), season title, overview, year, episode count, rating.
  - **Episodes list** with still image, episode number, title, runtime, air date, overview, and rating.
- **Trailer modal** for season-level trailers when available.
- **Watch Now** per episode uses the same streaming model as TV, passing TV ID and season number to the player.
- **Share** uses the same TV share template (`share_text_template_tv`) with URLs including `/season/{season_number}`.

#### Streaming Providers

- **Providers Directory**: Displays a searchable list of streaming platforms (`pages/Provider/Providers.tsx`).
- **Provider Details**: Shows movies and TV shows available on a specific provider with sorting by popularity (`pages/Provider/[ProviderId].tsx`).
- Includes a toggle to switch between Movies and TV Shows.

#### Actor details

- Fetches actor details with **movie_credits + images**.
- Shows:
  - Header with photo backdrop, name, birthday/place of birth.
  - Biography.
  - Filmography (sorted by release/air date, newest first).
  - Masonry-style photo gallery with full-screen viewer.
  - Share using remote-configurable template:
    - Template placeholders: `{name}`, `{url}`
    - URL built from `base_url` + `actor_slug` + ID (defaults if missing)

#### Player (Watch Now)

- Loads embedded playback in a WebView via `multiembed.mov` using TMDB ID.
- Locks orientation to **landscape** while active.

#### Bookmarks (Library)

- Tab shows saved items with:
  - Filters by status: All / Watching / Watch Later / Completed / Dropped.
  - Card view with poster, backdrop, status badge, overview preview.
  - Remove bookmark action.
- **Guest mode storage**:
  - Local SQLite table `bookmark` in `Movie_Night.db`.
  - Stores movieID, title, overview, poster/backdrop, type, status, timestamps.
- **Account mode storage**:
  - Supabase tables:
    - `movies` (metadata upsert by `movie_id`)
    - `bookmark` (user_id + movie_id + status; upsert on conflict)
  - Reads join bookmark → movies; normalizes into UI shape.

#### Authentication (Supabase)

- **Register**: email + password + username; saves username in `user_metadata`.
- **OTP confirm**: 8-digit signup verification; can resend OTP.
- **Login**: email + password.
- **Guest vs Account mode**:
  - Guest can browse and bookmark locally.
  - Account required to access Profile “account screen”.
  - On auth state change: set mood, set user, and sync guest bookmarks to cloud.
- **Social login**: Google button present but currently “Coming soon”.
- **Password recovery**: two-step **reset flow**:
  - Step 1: user enters email; app calls `resetPasswordForEmail` with a deep link.
  - Step 2: user enters OTP token + new password; app verifies via `verifyOtp(type: "recovery")` and then calls `updateUser` to set the new password.

#### Remote configuration & version enforcement

- App fetches latest row from Supabase table `app_config` and stores it in global state.
- Config fields (expected):
  - `base_url`, `movie_slug`, `actor_slug`, `tv_slug`
  - `min_app_version`, `latest_app_version`
  - `force_stop`, `force_message`
  - `app_link_update`
  - `share_text_template_movie`, `share_text_template_actor`, `share_text_template_tv`
- Behaviors:
  - **Maintenance**: force_stop blocks app with message.
  - **Update required**: blocks app if current version < min_app_version.
  - **Update available**: non-blocking alert if current version < latest_app_version.
- Refresh cadence: every **30 minutes**.

### Functional requirements (acceptance criteria)

- **Discovery**
  - Home shows trending carousel + 4 category rails when online.
  - Skeletons show while loading; no crash if API fails.
- **Search & filter**
  - Search triggers only when query length > 2 and after ~500ms pause.
  - Filter modal updates results; pagination works without duplicating or skipping pages.
- **Details**
  - Movie details render cast, trailer (if exists), similar/recommendations.
  - TV details render cast and similar, trailer (if exists).
  - Actor details show biography, filmography, photos (if exists), and open full-screen image viewer.
- **Bookmarks**
  - Bookmarking from details prompts for status and persists.
  - Updating status changes the badge and filter results.
  - Removing a bookmark removes it from the list.
- **Auth**
  - Register sends OTP email and routes to confirm screen.
  - OTP confirm logs user into Account mode.
  - Login logs user into Account mode.
  - When user logs in and guest bookmarks exist, they sync to cloud and local DB is cleared.
- **Operational**
  - If config forces maintenance or update_required, app shows block screen and does not show the main UI.
  - If update_available, app continues but shows an alert with an “Update” action opening `app_link_update`.

### Data & integrations

- **TMDB API** (The Movie Database)
  - Trending + categories + discover filters + search.
  - Movie details append: `credits`, `similar`, `videos`, `recommendations`.
  - Actor details append: `movie_credits`, `images`.
- **Supabase**
  - Auth + persisted session.
  - Postgres tables: `app_config`, `movies`, `bookmark`.
- **Local storage**
  - AsyncStorage: Supabase auth session; persisted mood/user subset via Zustand.
  - SQLite: guest bookmarks table.
- **Centralized Data**
  - All core TypeScript interfaces (Movie, Provider, Bookmark, Cast, Season, etc.) are centralized in `app/constant/interfaces.ts`.
  - Global constants (regions, default sections) are centralized in `app/constant/main.ts`.

### Requirements: UX/UI

- Dark “cinematic” theme and premium motion.
- **Floating Glassmorphism Navbar**: A rounded, semi-transparent capsule navigation bar with **Haptic Feedback** (`expo-haptics`) and dynamic safe area adaptation.
- Skeleton loading for list-heavy screens.
- Full-screen, immersive playback screen (landscape).
- **Parallax Effects**: Smooth scroll-based animations for hero banners using `react-native-reanimated`.

### Requirements: performance & reliability

- Use parallel fetches where possible (Home categories already do this).
- Avoid blocking UI on config refresh; refresh in background every 30 minutes.
- Graceful fallbacks for missing media (posters/backdrops/trailers).
- Handle offline state on startup.

### Security & privacy considerations

- **API keys and service keys** should not be hardcoded in client code. Current code includes a TMDB API key and Supabase anon key inline; production should migrate these to environment/config and/or server-side proxy where applicable.
- Bookmarks in Supabase are scoped by `user_id`.

### Analytics (recommended event taxonomy)

- **Navigation**
  - `tab_viewed` (tab: home|explore|bookmark|account)
- **Discovery**
  - `home_rail_impression` (rail: trending|top_rated|popular|upcoming|now_playing)
  - `content_opened` (type: movie|tv|actor, id)
- **Search/filters**
  - `search_performed` (query_length, page)
  - `filters_applied` (type, status, country, genres_count, year)
- **Bookmarks**
  - `bookmark_added` (type, id, status)
  - `bookmark_status_updated` (type, id, from_status, to_status)
  - `bookmark_removed` (type, id)
- **Auth**
  - `register_started`, `otp_verified`, `login_success`, `logout`
  - `guest_sync_started`, `guest_sync_completed`, `guest_sync_failed`
- **Ops**
  - `app_blocked` (reason: maintenance|update_required)
  - `update_available_shown`, `update_clicked`

### Risks & known gaps (from current implementation)

- **Streaming embed**: depends on a third-party embed site; may have availability/legal considerations.
- **Config docs**: detailed configuration is primarily documented inline in code and high-level in README/PRD; a dedicated configuration guide does not yet exist.

### Release plan (suggested)

- **MVP (current)**
  - Home discovery, Explore search/filters, details pages, trailer modal, bookmarks, auth, remote config enforcement.
- **vNext**
  - Align TV share with config templates + deep links.
  - Implement password reset flow (Supabase).
  - Harden media fallbacks, error states, and telemetry.
