import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { InferGetServerSidePropsType, MediaType } from "@/types/general";
import MediaListingView from "@/views/MediaListingView";
import * as TMDB from "@/lib/tmdb";
import { prepareMediaListData } from "@/lib/media-parser";
import { parseSlugToIdAndTitle } from "@/utils/util";
import { detectGenre } from "@/lib/route-parser";

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

  const method =
    mediaType === MediaType.Movie
      ? TMDB.discoverMoviesByGenreId
      : TMDB.discoverTvShowsByGenreId;

  const initialData = prepareMediaListData(await method(genre.id));

  const queryData = {
    method: method.name,
    genreId: slugData.id,
  };

  return {
    props: {
      initialData,
      queryData,
      mediaType,
      genre,
    },
  };
};

const Genre = ({
  initialData,
  queryData,
  mediaType,
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
      <MediaListingView initialData={initialData} queryData={queryData} />
    </>
  );
};

export default Genre;
