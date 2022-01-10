export interface SingleItemData {
  id: number;
  title: string;
  rating: number;
  posterUrl: string;
  redirectSlug: string;
  year: number;
  genreIds: Array<number>;
  releaseDate: string;
}

export interface Genre {
  id: number;
  name: string;
  redirectPath: string;
}

export interface SingleCrew {
  id: number;
  job: string;
  name: string;
}

export interface SingleCast {
  id: number;
  name: string;
  character: string;
  profileImageUrl: string;
}

export interface Platform {
  id: number;
  name: string;
  logoUrl: string;
}

export interface DetailPageData {
  title: string;
  type: string;
  posterImageUrl: string;
  backgroundImageUrl: string | null;
  isReleased: boolean | null;
  isEnded?: boolean | null;
  genres: Genre[];
  rating: number;
  duration: number;
  durationFormatted: string;
  releaseDate: string;
  endDate: string | null;
  year: number;
  endYear: number | null;
  trailerUrl: string | null;
  platform: Platform[];
  overview: string;
  directors: string | null;
  creators: string | null;
  directorData: SingleCrew[] | [];
  creatorData: SingleCrew[] | [];
  castData: SingleCast[] | [];
}

export interface MultiSearch {
  movies: SearchSub[];
  tvShows: SearchSub[];
}

export interface SearchSub {
  id: number;
  title: string;
  redirectUrl: string;
  year: string;
  posterUrl: string;
}
