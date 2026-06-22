export type Movie = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  vote_average?: number;
  known_for_department?: string;
  popularity?: number;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  region?: string;
  category?: string;
};

export type TrendProps = {
  id: number;
  cover: string;
  movieTitle: string;
  rating?: number;
  mediaType?: "movie" | "tv";
};

export type MovieData = {
  id: number;
  backdrop_path: string;
  title?: string;
  name?: string;
  vote_average?: number;
  media_type?: "movie" | "tv";
};

export type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
};

export type SectionContent = {
  id?: number;
  title: string;
  endpoint: string;
  type: string;
  is_active?: boolean;
};


export type Tab = "movie" | "tv";

export interface Bookmark {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  movieID: string;
  type: "movie" | "tv";
  status: string;
}

export type Cast = {
  id: number;
  profile_path: string;
  name: string;
  character?: string;
  known_for_department?: string;
};

export type Season = {
  id: number;
  name: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  vote_average: number;
};
export type ImageQuality = "High" | "Medium" | "Low";
export type PageType = "Home" | "Explore" | "NightGuide" | "Bookmark" | "Account";

export type AppConfig = {
  base_url: string;
  movie_slug: string;
  tv_slug: string;
  actor_slug: string;
  min_app_version: string;
  latest_app_version: string;
  force_stop: boolean;
  platform:string;
  force_message: string;
  app_link_update: string;
  share_text_template_movie: string;
  share_text_template_tv: string;
  share_text_template_actor: string;
};