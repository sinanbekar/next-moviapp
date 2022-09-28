import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { NextSeo } from "next-seo";
import * as TMDB from "@/lib/tmdb";
import { parseMediaSingleItemData } from "@/utils/index";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const rawMediaData =
    context.query?.sort === "popular"
      ? await TMDB.getPopularTvShows()
      : await TMDB.getTrendingTvShows();

  const mediaData = rawMediaData.results.map((media) =>
    parseMediaSingleItemData(media)
  );

  const queryData = {
    method:
      context.query?.sort === "popular"
        ? TMDB.getPopularMovies.name
        : TMDB.getTrendingMovies.name,
  };

  return {
    props: {
      mediaData,
      queryData,
    },
  };
};

const TvShows = ({
  mediaData,
  queryData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <NextSeo
        title={`${
          router.query?.sort === "popular" ? "Popular" : "Trending"
        } TV Shows`}
        description="Explore trending, popular tv shows!"
      />
      <MediaListingView mediaData={mediaData} queryData={queryData} />
    </>
  );
};

export default TvShows;
