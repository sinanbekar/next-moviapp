import React from "react";
import SingleItem from "@/components/SingleItem";
import Slider from "@/components/Slider";
import { parseSingleItemData } from "@/helpers/movi";
import { TMDB } from "@/lib/tmdb";
import Layout from "@/components/Layout";
import InfiniteScroll from "@/components/InfiniteScroll";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Movies } from "@/types/tmdb/popular";
import { SeoHead } from "@/helpers/seo";
import { useRouter } from "next/router";

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
      moviesData,
      tmdbQueryString,
    },
  };
};

const Movies = ({
  moviesData,
  tmdbQueryString,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [moviesDataState, setMoviesDataState] =
    React.useState<Movies>(moviesData);
  const router = useRouter();
  React.useEffect(() => {
    setMoviesDataState(moviesData);
  }, [moviesData]);

  return (
    <Layout>
      <SeoHead
        title={`${
          router.query?.sort === "popular" ? "Popular" : "Trending"
        } Movies`}
        description="Explore trending, popular movies!"
      />
      <Slider sliderItems={moviesDataState.results.slice(0, 4)} />
      <div className="py-8 flex flex-wrap justify-between gap-4">
        {moviesDataState.results.slice(4).map((data) => (
          <SingleItem key={data.id} item={parseSingleItemData(data)} />
        ))}
        <InfiniteScroll
          setDataState={setMoviesDataState}
          tmdbQueryString={tmdbQueryString}
        />
      </div>
    </Layout>
  );
};

export default Movies;
