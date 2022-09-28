import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { InferGetServerSidePropsType, MediaType } from "@/types/general";
import MediaListingView from "@/views/MediaListingView";
import * as TMDB from "@/lib/tmdb";
import { parseSlugToIdAndTitle } from "../../../../utils/util";
import { detectGenre } from "../../../../utils/router-util";
import { parseMediaSingleItemData } from "../../../../utils/media-parser";

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

  const rawMediaData =
    mediaType === "movie"
      ? await TMDB.discoverMoviesByGenreId(genre.id)
      : await TMDB.discoverTvShowsByGenreId(genre.id);

  const mediaData = rawMediaData.results.map((media) =>
    parseMediaSingleItemData(media)
  );

  const queryData = {
    method:
      mediaType === MediaType.Movie
        ? TMDB.discoverMoviesByGenreId.name
        : TMDB.discoverTvShowsByGenreId.name,
    genreId: slugData.id,
  };

  return {
    props: {
      mediaData,
      mediaType,
      queryData,
      genre,
    },
  };
};

const Genre = ({
  mediaData,
  mediaType,
  queryData,
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
      <MediaListingView mediaData={mediaData} queryData={queryData} />
    </>
  );
};

export default Genre;
