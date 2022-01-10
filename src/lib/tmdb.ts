import { MovieDetails, TvDetails } from "@/types/tmdb/detail";
import { Search, TMDBResponse } from "@/types/tmdb/generic";
import { Movies, TvShows } from "@/types/tmdb/popular";

export class TMDB {
  static readonly baseUrl: string = "https://api.themoviedb.org/3";
  static readonly apiKeyParamString: string = `?api_key=${process.env.TMDB_APIKEY}`;

  static readonly discoverMoviesEndpoint: string = `/discover/movie`;
  static readonly discoverTVEndpoint: string = `/discover/tv`;

  static movieEndpoint = (movieId: number) => `/movie/${movieId}`;
  static tvEndpoint = (tvId: number) => `/tv/${tvId}`;

  static readonly trendingMoviesEndpoint: string = `/trending/movie/week`;
  static readonly trendingTVEndpoint: string = `/trending/tv/week`;

  static readonly popularMoviesEndpoint: string = `/movie/popular`;
  static readonly popularTVEndpoint: string = `/tv/popular`;

  static readonly searchMovieEndpoint: string = `/search/movie`;
  static readonly searchTVEndpoint: string = `/search/tv`;
  static readonly searchMultiEndpoint: string = `/search/multi`;

  static readonly posterDefaultUrl =
    "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";

  static readonly profilePicDefaultUrl =
    "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg";

  static backdropPathToAbsoluteUrl(path: string) {
    return `https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${path}`;
  }

  static posterPathToAbsoluteUrl(path: string) {
    return `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${path}`;
  }

  static profilePicPathToAbsoluteUrl(path: string) {
    return `https://www.themoviedb.org/t/p/w276_and_h350_face/${path}`;
  }

  static apiFetch(endPoint: string, additionalParams: string[] = []) {
    let response: Response;

    const url = `${this.baseUrl}${endPoint}${this.apiKeyParamString}${
      additionalParams.length !== 0 && "&"
    }${additionalParams.join("&")}`;

    return fetch(encodeURI(url))
      .then((responseObject) => {
        response = responseObject;
        return response.json();
      })
      .then((parsedResponse) => {
        if (response.status < 200 || response.status >= 300) {
          throw parsedResponse;
        }
        return parsedResponse;
      })
      .catch((error) => {
        if (error.status_code === 6) {
          throw new TMDBIdNotFound();
        }
        throw new TMDBError(JSON.stringify(error));
      });
  }

  static async discoverMovies(page: number = 1): Promise<TMDBResponse<Movies>> {
    return this.apiFetch(this.discoverMoviesEndpoint, [`page=${page}`]);
  }

  static async discoverTvShows(page: number = 1): Promise<TMDBResponse<TvShows>> {
    return this.apiFetch(this.discoverTVEndpoint, [`page=${page}`]);
  }

  static async getTrendingMovies(
    page: number = 1
  ): Promise<TMDBResponse<Movies>> {
    return this.apiFetch(this.trendingMoviesEndpoint, [`page=${page}`]);
  }

  static async getTrendingTvShows(
    page: number = 1
  ): Promise<TMDBResponse<TvShows>> {
    return this.apiFetch(this.trendingTVEndpoint, [`page=${page}`]);
  }

  static async getPopularMovies(
    page: number = 1
  ): Promise<TMDBResponse<Movies>> {
    return this.apiFetch(this.popularMoviesEndpoint, [`page=${page}`]);
  }

  static async getPopularTvShows(
    page: number = 1
  ): Promise<TMDBResponse<TvShows>> {
    return this.apiFetch(this.popularTVEndpoint, [`page=${page}`]);
  }

  static async discoverMoviesByGenreId(
    genreId: number,
    page: number = 1
  ): Promise<TMDBResponse<Movies>> {
    return this.apiFetch(this.discoverMoviesEndpoint, [
      `with_genres=${genreId}`,
      `page=${page}`,
    ]);
  }
  static async discoverTvShowsByGenreId(
    genreId: number,
    page: number = 1
  ): Promise<TMDBResponse<TvShows>> {
    return this.apiFetch(this.discoverTVEndpoint, [
      `with_genres=${genreId}`,
      `page=${page}`,
    ]);
  }

  static async getMovieDetailsById(
    movieId: number
  ): Promise<TMDBResponse<MovieDetails>> {
    return this.apiFetch(this.movieEndpoint(movieId), [
      `append_to_response=credits,videos,watch/providers`,
    ]);
  }

  static async getTvShowDetailsById(
    tvId: number
  ): Promise<TMDBResponse<TvDetails>> {
    return this.apiFetch(this.tvEndpoint(tvId), [
      `append_to_response=credits,videos,watch/providers`,
    ]);
  }

  static async searchMovie(
    query: string,
    page: number = 1
  ): Promise<TMDBResponse<Search<Movies>>> {
    return this.apiFetch(this.searchMovieEndpoint, [
      `query=${query}`,
      `page=${page}`,
    ]);
  }

  static async searchTvShows(
    query: string,
    page: number = 1
  ): Promise<TMDBResponse<Search<TvShows>>> {
    return this.apiFetch(this.searchTVEndpoint, [
      `query=${query}`,
      `page=${page}`,
    ]);
  }

  static async searchMulti(
    query: string,
    page: number = 1
  ): Promise<TMDBResponse<Search<any>>> {
    return this.apiFetch(this.searchMultiEndpoint, [
      `query=${query}`,
      `page=${page}`,
    ]);
  }
}

export class TMDBError extends Error {
  constructor(msg: string = "") {
    super(msg);
    Object.setPrototypeOf(this, TMDBError.prototype);
  }
}

export class TMDBIdNotFound extends TMDBError {
  constructor(msg: string = "") {
    super(msg);
    Object.setPrototypeOf(this, TMDBError.prototype);
  }
}
