import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import MediaListingView from "@/views/MediaListingView";
import { TMDB } from "@/lib/tmdb";
import { parseSlugToIdAndTitle, SeoHead } from "@/helpers/seo";
import { isGenrePageSlug } from "@/helpers/movi";
import { movieGenres, tvGenres } from "@/data/genres";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slugData = parseSlugToIdAndTitle(context.params?.slug as string);
  const mediaType = context.params?.type as string;

  if (!isGenrePageSlug(slugData, mediaType)) {
    return {
      notFound: true,
    };
  }

  const genreMeta = {
    mediaType: mediaType,
    genre: (mediaType === "movie" ? movieGenres : tvGenres).find(
      (genre) => genre.id === slugData.id
    ),
  };

  const genreData =
    mediaType === "movie"
      ? await TMDB.discoverMoviesByGenreId(slugData.id)
      : mediaType === "tv"
      ? await TMDB.discoverTvShowsByGenreId(slugData.id)
      : { results: [] };

  const tmdbQueryString = `method=${
    mediaType === "movie"
      ? "discoverMoviesByGenreId"
      : mediaType === "tv"
      ? "discoverTvShowsByGenreId"
      : ""
  }&genreId=${slugData.id}`;

  return {
    props: {
      mediaData: genreData,
      tmdbQueryString,
      genreMeta,
    },
  };
};

const Genre = ({
  mediaData,
  tmdbQueryString,
  genreMeta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SeoHead
        title={`${genreMeta.genre.name} ${
          genreMeta.mediaType === "movie" ? "Movies" : "TV Shows"
        }`}
        description={`Explore ${genreMeta.genre.name} ${
          genreMeta.mediaType === "movie" ? "Movies" : "TV Shows"
        }`}
      />
      <MediaListingView {...{ mediaData, tmdbQueryString }} />
    </>
  );
};

export default Genre;
