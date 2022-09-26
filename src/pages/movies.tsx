import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { SeoHead } from "@/helpers/seo";
import { TMDB } from "@/lib/tmdb";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const moviesData =
    context.query?.sort === "popular"
      ? await TMDB.getPopularMovies()
      : await TMDB.getTrendingMovies();

  const tmdbQueryString = `method=${
    context.query?.sort === "popular" ? "getPopularMovies" : "getTrendingMovies"
  }`;

  return {
    props: {
      mediaData: moviesData,
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
      <SeoHead
        title={`${
          router.query?.sort === "popular" ? "Popular" : "Trending"
        } Movies`}
        description="Explore trending, popular movies!"
      />
      <MediaListingView {...{ mediaData, tmdbQueryString }} />
    </>
  );
};

export default Movies;
