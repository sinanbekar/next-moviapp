import React from "react";
import SingleItem from "@/components/SingleItem";
import Slider from "@/components/Slider";
import { parseSingleItemData } from "@/helpers/movi";
import { TMDB } from "@/lib/tmdb";
import Layout from "@/components/Layout";
import InfiniteScroll from "@/components/InfiniteScroll";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { TvShows } from "@/types/tmdb/popular";
import { SeoHead } from "@/helpers/seo";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tvShowsData =
    context.query?.sort === "popular"
      ? await TMDB.getPopularTvShows()
      : await TMDB.getTrendingTvShows();

  const tmdbQueryString = `method=${
    context.query?.sort === "popular" ? "getPopularTvShows" : "getTrendingTvShows"
  }`;

  return {
    props: {
      tvShowsData,
      tmdbQueryString,
    },
  };
};

const TvShows = ({
  tvShowsData,
  tmdbQueryString,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [tvShowsDataState, setTvShowsDataState] =
    React.useState<TvShows>(tvShowsData);
  const router = useRouter();
  React.useEffect(() => {
    setTvShowsDataState(tvShowsData);
  }, [tvShowsData]);

  return (
    <Layout>
      <SeoHead
        title={`${
          router.query?.sort === "popular" ? "Popular" : "Trending"
        } TV Shows`}
        description="Explore trending, popular tv shows!"
      />
      <Slider sliderItems={tvShowsDataState.results.slice(0, 4)} />
      <div className="py-8 flex flex-wrap justify-between gap-4">
        {tvShowsDataState.results.slice(4).map((data) => (
          <SingleItem key={data.id} item={parseSingleItemData(data)} />
        ))}
        <InfiniteScroll
          setDataState={setTvShowsDataState}
          tmdbQueryString={tmdbQueryString}
        />
      </div>
    </Layout>
  );
};

export default TvShows;
