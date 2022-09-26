import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { InferGetServerSidePropsType } from "@/types/general";
import MediaListingView from "@/views/MediaListingView";
import { TMDB } from "@/lib/tmdb";
import { parseSlugToIdAndTitle} from "@/helpers/generic";
import { detectGenre } from "@/helpers/movi";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slugData = parseSlugToIdAndTitle(context.params?.slug as string);
  const mediaType = context.params?.type as string;

  const genre = detectGenre(slugData, mediaType);

  if (!genre) {
    return {
      notFound: true,
    };
  }

  const mediaData =
    mediaType === "movie"
      ? await TMDB.discoverMoviesByGenreId(genre.id)
      : await TMDB.discoverTvShowsByGenreId(genre.id);

  const tmdbQueryString = `method=${
    mediaType === "movie"
      ? "discoverMoviesByGenreId"
      : mediaType === "tv"
      ? "discoverTvShowsByGenreId"
      : ""
  }&genreId=${slugData.id}`;

  return {
    props: {
      mediaData,
      mediaType,
      tmdbQueryString,
      genre,
    },
  };
};

const Genre = ({
  mediaData,
  mediaType,
  tmdbQueryString,
  genre,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <NextSeo
        title={`${genre.name} ${mediaType === "movie" ? "Movies" : "TV Shows"}`}
        description={`Explore ${genre.name} ${
          mediaType === "movie" ? "Movies" : "TV Shows"
        }`}
      />
      <MediaListingView
        mediaData={mediaData}
        tmdbQueryString={tmdbQueryString}
      />
    </>
  );
};

export default Genre;
