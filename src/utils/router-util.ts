import { MovieDetails, TvDetails } from "@/types/tmdb/detail";
import { NextRouter } from "next/router";
import { slugify } from "./util";
import { detectMediaType } from "./media-parser";
import { parseSlugToIdAndTitle } from "./util";
import { movieGenres, tvGenres } from "@/data/genres";
import { MediaType } from "@/types/general";

export const getRouteData = (router: NextRouter) => {
  const genrePathName = "/genre/[slug]/[type]";
  const isGenrePage = router.pathname === genrePathName;
  const isMoviesPage =
    router.pathname.startsWith("/movies") ||
    router.pathname.startsWith("/movie") ||
    (isGenrePage && router.query.type === MediaType.Movie);
  const isTvPage =
    router.pathname.startsWith("/tv") ||
    (isGenrePage && router.query.type === MediaType.TV);
  const genreId = isGenrePage
    ? parseSlugToIdAndTitle(router.query?.slug as string).id
    : 0;
  const sortVal = router.query.sort ?? (isGenrePage ? "popular" : "trending");
  const mediaTypeListPath = isMoviesPage ? "/movies" : isTvPage ? "/tv" : null;
  const currentPageMediaType = isMoviesPage ? "movie" : isTvPage ? "tv" : null;

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

type SlugData = {
  id: number;
  title: string;
};

export const isDetailPageSlug = (
  data: MovieDetails | TvDetails,
  slugData: SlugData
) => {
  const mediaType = detectMediaType(data);

  const title =
    mediaType === MediaType.Movie
      ? (data as MovieDetails).title
      : (data as TvDetails).name;

  return slugData.title === slugify(title);
};

export const detectGenre = (slugData: SlugData, mediaType: string) => {
  if (slugData.id === 0) return undefined;

  return (
    mediaType === MediaType.Movie
      ? movieGenres
      : mediaType === MediaType.TV
      ? tvGenres
      : []
  ).find(
    (genre) =>
      genre.id === slugData.id &&
      slugify(genre.name) === slugify(slugData.title)
  );
};
