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
      ? await TMDB.getPopularMovies()
      : await TMDB.getTrendingMovies();

  const tmdbQueryString = `method=${
    context.query?.sort === "popular" ? "getPopularMovies" : "getTrendingMovies"
  }`;

  return {
    props: {
      mediaData: mediaData,
      tmdbQueryString,
    },
  };
};

const Movies = ({
  mediaData,
  tmdbQueryString,
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
      <MediaListingView
        mediaData={mediaData}
        tmdbQueryString={tmdbQueryString}
      />
    </>
  );
};

export default Movies;
