import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { SeoHead } from "@/helpers/seo";
import { TMDB } from "@/lib/tmdb";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tvShowsData =
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
      mediaData: tvShowsData,
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
      <SeoHead
        title={`${
          router.query?.sort === "popular" ? "Popular" : "Trending"
        } TV Shows`}
        description="Explore trending, popular tv shows!"
      />
      <MediaListingView {...{ mediaData, tmdbQueryString }} />
    </>
  );
};

export default TvShows;
