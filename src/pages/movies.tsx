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
      ? TMDB.getPopularMovies
      : TMDB.getTrendingMovies;

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

const Movies = ({
  initialData,
  queryData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <NextSeo
        title={`${
          router.query?.sort === "popular" ? "Popular" : "Trending"
        } Movies`}
        description="Explore trending, popular movies!"
      />
      <MediaListingView initialData={initialData} queryData={queryData} />
    </>
  );
};

export default Movies;
