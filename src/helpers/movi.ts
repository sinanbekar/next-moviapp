import { slugify, fullDateToYear } from "@/helpers/generic";
import { MoviesResult, TvResult } from "@/types/tmdb/popular";
import {
  DetailPageData,
  Genre,
  Platform,
  SingleCast,
  SingleCrew,
  SingleItemData,
} from "@/types/parsed-tmdb";
import { TMDB } from "@/lib/tmdb";
import { MovieDetails, TvDetails } from "@/types/tmdb/detail";
import { Crew } from "@/types/tmdb/generic";
import { formatMinutes } from "@/helpers/generic";
import { NextRouter } from "next/router";
import { SlugData } from "@/types/generic";
import { parseSlugToIdAndTitle } from "@/helpers/seo";

export function parseSingleItemData(data: MoviesResult | TvResult) {
  const isMovie = "first_air_date" in data ? false : true;
  const title = isMovie ? (data as MoviesResult).title : data.name;
  const redirectSlug = `/${isMovie ? "movie" : "tv"}/${data.id}-${slugify(
    title
  )}`;

  const releaseDate = isMovie
    ? (data as MoviesResult).release_date
    : (data as TvResult).first_air_date;

  const returnData: SingleItemData = {
    id: data.id,
    title: title,
    rating: data.vote_average,
    posterUrl: data.poster_path
      ? TMDB.posterPathToAbsoluteUrl(data.poster_path)
      : TMDB.posterDefaultUrl,
    redirectSlug: redirectSlug,
    releaseDate: releaseDate,
    year: fullDateToYear(releaseDate),
    genreIds: data.genre_ids,
  };
  return returnData;
}

export function parseDetailPageData(
  data: MovieDetails | TvDetails | null
): DetailPageData | null {
  if (!data) return null;

  const isMovie = "first_air_date" in data ? false : true;

  const directorData: SingleCrew[] = data.credits.crew
    .filter((singleCrew: Crew) => singleCrew.job === "Director")
    .map(
      (singleCrew) =>
        <SingleCrew>{
          id: singleCrew.id,
          job: singleCrew.job,
          name: singleCrew.name,
        }
    );

  const creatorData: SingleCrew[] = data.credits.crew
    .filter((singleCrew: Crew) => singleCrew.job === "Creator")
    .map(
      (singleCrew) =>
        <SingleCrew>{
          id: singleCrew.id,
          job: singleCrew.job,
          name: singleCrew.name,
        }
    );

  const castData: SingleCast[] = data.credits.cast.map(
    (singleCast) =>
      <SingleCast>{
        id: singleCast.id,
        name: singleCast.name,
        character: singleCast.character,
        profileImageUrl: singleCast.profile_path
          ? TMDB.profilePicPathToAbsoluteUrl(singleCast.profile_path)
          : TMDB.profilePicDefaultUrl,
      }
  );

  const genreData: Genre[] = data.genres.map(
    (genre) =>
      <Genre>{
        id: genre.id,
        name: genre.name,
        redirectPath: `/genre/${genre.id}-${slugify(genre.name)}/${
          isMovie ? "movie" : "tv"
        }`,
      }
  );
  const videoId = getVideoId(data);
  const trailerUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : null;

  const platformData: Platform[] =
    data["watch/providers"].results?.US?.flatrate
      ?.map(
        (provider) =>
          <Platform>{
            id: provider.provider_id,
            name: provider.provider_name,
            logoUrl: `https://www.themoviedb.org/t/p/original/${provider.logo_path}`,
          }
      )
      .slice(0, 4) ?? [];

  const isReleased = () => {
    const date =
      (data as MovieDetails).release_date ??
      (data as TvDetails).first_air_date ??
      null;
    if (!date) return null;

    if (new Date(date).getTime() > new Date().getTime()) {
      return false;
    } else {
      return true;
    }
  };

  const duration =
    (data as MovieDetails).runtime ??
    (data as TvDetails).episode_run_time[0];

  const releaseDate = isMovie
    ? (data as MovieDetails).release_date
    : (data as TvDetails).first_air_date;

  const endDate = !isMovie ? (data as TvDetails).last_air_date : null;

  return {
    title: (data as MovieDetails).title ?? (data as TvDetails).name,
    type: isMovie ? "movie" : "tv",
    posterImageUrl: data.poster_path
      ? TMDB.posterPathToAbsoluteUrl(data.poster_path)
      : TMDB.posterDefaultUrl,
    backgroundImageUrl: data.backdrop_path
      ? TMDB.backdropPathToAbsoluteUrl(data.backdrop_path)
      : null,
    isReleased: isReleased(),
    isEnded: !isMovie ? (data.status === "Ended" ? true : false) : null,
    genres: genreData,
    rating: data.vote_average,
    duration: duration,
    durationFormatted: formatMinutes(duration),
    releaseDate: releaseDate,
    endDate: endDate,
    year: fullDateToYear(releaseDate),
    endYear: endDate ? fullDateToYear(endDate) : null,
    trailerUrl: trailerUrl,
    platform: platformData,
    overview: data.overview,
    directors: directorData.map((e) => e.name).join(", "),
    creators: creatorData.map((e) => e.name).join(", "),
    creatorData: creatorData,
    directorData: directorData,
    castData: castData,
  };
}

export const getGenreDataFromId = (id: number) => {
  const movieGenres: { id: number; name: string }[] =
    require("@/data/genres").movieGenres;
  return movieGenres.find((genre) => genre.id === id);
};

export const getVideoId = (data: MovieDetails | TvDetails) => {
  const index = data.videos?.results?.findIndex(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  return index !== -1 ? data.videos?.results[index]?.key : null;
};

export const getRouteData = (router: NextRouter) => {
  const genrePathName: string = "/genre/[slug]/[type]";
  const isGenrePage: boolean = router.pathname === genrePathName;
  const isMoviesPage: boolean =
    router.pathname.startsWith("/movies") ||
    router.pathname.startsWith("/movie") ||
    (isGenrePage && router.query.type === "movie");
  const isTvPage: boolean =
    router.pathname.startsWith("/tv") ||
    (isGenrePage && router.query.type === "tv");
  const genreId = isGenrePage
    ? parseSlugToIdAndTitle(router.query?.slug as string).id
    : 0;
  const sortVal =
    (router.query?.sort as string) ?? (isGenrePage ? "popular" : "trending");

  const mediaTypeListPath = isMoviesPage
    ? "/movies"
    : isTvPage
    ? "/tv"
    : null;

  const currentPageMediaType = isMoviesPage
    ? "movie"
    : isTvPage
    ? "tv"
    : null;

  return {
    genrePathName,
    isMoviesPage,
    isTvPage,
    isGenrePage,
    genreId,
    sortVal,
    currentPageMediaType,
    mediaTypeListPath,
  };
};

export const isDetailPageSlug = (
  data: MovieDetails | TvDetails | null,
  slugData: SlugData
) => {
  if (!data) return null;

  return (
    slugData.title ===
    slugify((data as MovieDetails).title ?? (data as TvDetails).name)
  );
};

export const isGenrePageSlug = (slugData: SlugData, mediaType: string) => {
  const movieGenres: { id: number; name: string }[] =
    require("@/data/genres").movieGenres;
  const tvGenres: { id: number; name: string }[] =
    require("@/data/genres").tvGenres;
  return (
    (mediaType === "movie" &&
      slugify(movieGenres.find((genre) => genre.id === slugData.id)?.name) ===
        slugify(slugData.title)) ||
    (mediaType === "tv" &&
      slugify(tvGenres.find((genre) => genre.id === slugData.id)?.name) ===
        slugify(slugData.title))
  );
};
