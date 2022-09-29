import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { NextSeo } from "next-seo";
import * as TMDB from "@/lib/tmdb";
import { prepareMediaListData } from "@/lib/media-parser";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const method =
    context.query?.sort === "popular"
      ? TMDB.getPopularTvShows
      : TMDB.getTrendingTvShows;

  const initialData = prepareMediaListData(await method());

  const queryData = {
    method: method.name,
  };

  return {
    props: {
      initialData,
      queryData,
    },
  };
};

const TvShows = ({
  initialData,
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
      <MediaListingView initialData={initialData} queryData={queryData} />
    </>
  );
};

export default TvShows;
