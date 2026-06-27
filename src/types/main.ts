import { SectionContent } from "./interfaces";

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p";
export const base_url = "https://api.themoviedb.org/3";
// High
export const posterUrlHigh = `${BASE_IMAGE_URL}/w780`;
export const posterUrlHighMovie = `${BASE_IMAGE_URL}/original`;
export const backdropUrlHigh = `${BASE_IMAGE_URL}/w1280`;
export const backdropUrlHighMovie = `${BASE_IMAGE_URL}/original`;
export const CastUrlHigh = `${BASE_IMAGE_URL}/w780`;

// Medium
export const posterUrlMedium = `${BASE_IMAGE_URL}/w500`;
export const posterUrlMediumMovie = `${BASE_IMAGE_URL}/w780`;
export const backdropUrlMedium = `${BASE_IMAGE_URL}/w780`;
export const backdropUrlMediumMovie = `${BASE_IMAGE_URL}/w1280`;
export const CastUrlMedium = `${BASE_IMAGE_URL}/h632`;

// Low
export const posterUrlLow = `${BASE_IMAGE_URL}/w342`;
export const posterUrlLowMovie = `${BASE_IMAGE_URL}/w342`;
export const backdropUrlLow = `${BASE_IMAGE_URL}/w300`;
export const backdropUrlLowMovie = `${BASE_IMAGE_URL}/w780`;
export const CastUrlLow = `${BASE_IMAGE_URL}/w185`;

export const regions: Record<string, string> = {
  EG: "Egypt",
  US: "USA",
  GB: "UK",
  SA: "Saudi Arabia",
  AE: "UAE",
  FR: "France",
  DE: "Germany",
  CA: "Canada",
  AU: "Australia",
  IT: "Italy",
  ES: "Spain",
};

export const regionLanguageMap: Record<string, string> = {
  US: "en",
  GB: "en",
  EG: "ar",
  SA: "ar",
  FR: "fr",
  JP: "ja",
  KR: "ko",
  IN: "hi",
  CN: "zh",
  DE: "de",
  ES: "es",
  IT: "it",
  RU: "ru",
  TR: "tr",
  BR: "pt",
  MX: "es",
};

export const defaultSections: SectionContent[] = [
  { endpoint: "/movie/popular", title: "Popular Movies", type: "movie" },
  { endpoint: "/tv/popular", title: "Popular TV Shows", type: "tv" },
  { endpoint: "/movie/top_rated", title: "Top Rated Movies", type: "movie" },
  { endpoint: "/tv/top_rated", title: "Top Rated TV Shows", type: "tv" },
  {
    endpoint: "/movie/now_playing",
    title: "Now Playing Movies",
    type: "movie",
  },
  { endpoint: "/tv/now_playing", title: "Now Playing TV Shows", type: "tv" },
  { endpoint: "/tv/airing_today", title: "Airing Today TV Shows", type: "tv" },
  { endpoint: "/movie/upcoming", title: "Coming Soon Movies", type: "movie" },
  { endpoint: "/tv/on_the_air", title: "Coming Soon TV Shows", type: "tv" },
  {
    endpoint: "/discover/movie?vote_average.gte=7.5&vote_count.gte=1000",
    title: "Critically Acclaimed Movies",
    type: "movie",
  },
  {
    endpoint: "/discover/movie?with_genres=28",
    title: "Action Movies",
    type: "movie",
  },
  {
    endpoint: "/discover/movie?with_genres=35",
    title: "Comedy Movies",
    type: "movie",
  },
];

export const iconMap = {
  imdb: {
    name: "imdb",
    color: "#F5C518",
    baseUrl: "https://www.imdb.com/name/",
    key: "imdb_id",
  },
  instagram: {
    name: "instagram",
    color: "#E1306C",
    baseUrl: "https://www.instagram.com/",
    key: "instagram_id",
  },
  facebook: {
    name: "facebook",
    color: "#1877F2",
    baseUrl: "https://www.facebook.com/",
    key: "facebook_id",
  },
  twitter: {
    name: "twitter",
    color: "#1DA1F2",
    baseUrl: "https://twitter.com/",
    key: "twitter_id",
  },
  tiktok: {
    name: "tiktok",
    color: "#000",
    baseUrl: "https://www.tiktok.com/@",
    key: "tiktok_id",
  },
  youtube: {
    name: "youtube",
    color: "#FF0000",
    baseUrl: "https://www.youtube.com/",
    key: "youtube_id",
  },
  wikidata: {
    name: "wikipedia-w",
    color: "#006699",
    baseUrl: "https://www.wikidata.org/wiki/",
    key: "wikidata_id",
  },
};