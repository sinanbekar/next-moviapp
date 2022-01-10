import {
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  CreatedBy,
  LastEpisodeToAir,
  Network,
  Season,
  Credits,
  Videos,
} from "@/types/tmdb/generic";

import { WatchProviders } from "@/types/tmdb/watch-providers";

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: any;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  /* appended */
  credits: Credits;
  videos: Videos;
  "watch/providers": WatchProviders;
  /* appended */
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TvDetails {
  backdrop_path: string;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air?: any;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  /* appended */
  credits: Credits;
  videos: Videos;
  "watch/providers": WatchProviders;
  /* appended */
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}
