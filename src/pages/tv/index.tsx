import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { NextSeo } from "next-seo";
import { TMDB } from "@/lib/tmdb";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const mediaData =
    context.query?.sort === "popular"
      ? await TMDB.getPopularTvShows()
      : await TMDB.getTrendingTvShows();

  const tmdbQueryString = `method=${
    context.query?.sort === "popular"
      ? "getPopularTvShows"
      : "getTrendingTvShows"
  }`;

  return {
    props: {
      mediaData: mediaData,
      tmdbQueryString,
    },
  };
};

const TvShows = ({
  mediaData,
  tmdbQueryString,
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
      <MediaListingView
        mediaData={mediaData}
        tmdbQueryString={tmdbQueryString}
      />
    </>
  );
};

export default TvShows;
