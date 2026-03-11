import { SectionContent } from "./interfaces";

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p";

// High
export const posterUrlHigh = `${BASE_IMAGE_URL}/w780`;
export const posterUrlHighMovie = `${BASE_IMAGE_URL}/original`;
export const backdropUrlHigh = `${BASE_IMAGE_URL}/w1280`;
export const backdropUrlHighMovie = `${BASE_IMAGE_URL}/original`;
export const CastUrlHigh = `${BASE_IMAGE_URL}/original`;

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
