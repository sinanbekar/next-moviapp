import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import { TMDB } from "@/lib/tmdb";
import Layout from "@/components/Layout";
import Slider from "@/components/Slider";
import SingleItem from "@/components/SingleItem";
import InfiniteScroll from "@/components/InfiniteScroll";
import { parseSlugToIdAndTitle, SeoHead } from "@/helpers/seo";
import { isGenrePageSlug, parseSingleItemData } from "@/helpers/movi";
import { Movies, TvShows } from "@/types/tmdb/popular";
import { movieGenres, tvGenres } from "@/data/genres";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slugData = parseSlugToIdAndTitle(context.params?.slug as string);
  const mediaType = context.params?.type as string;

  if (!isGenrePageSlug(slugData, mediaType)) {
    return {
      notFound: true,
    };
  }

  const genreMeta = {
    mediaType: mediaType,
    genre: (mediaType === "movie" ? movieGenres : tvGenres).find(
      (genre) => genre.id === slugData.id
    ),
  };

  const genreData =
    mediaType === "movie"
      ? await TMDB.discoverMoviesByGenreId(slugData.id)
      : mediaType === "tv"
      ? await TMDB.discoverTvShowsByGenreId(slugData.id)
      : { results: [] };

  const tmdbQueryString = `method=${
    mediaType === "movie"
      ? "discoverMoviesByGenreId"
      : mediaType === "tv"
      ? "discoverTvShowsByGenreId"
      : ""
  }&genreId=${slugData.id}`;

  return {
    props: {
      genreData,
      tmdbQueryString,
      genreMeta,
    },
  };
};

const Genre = ({
  genreData,
  tmdbQueryString,
  genreMeta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [genreDataState, setGenreDataState] = React.useState<Movies | TvShows>(
    genreData
  );

  React.useEffect(() => {
    setGenreDataState(genreData);
  }, [genreData]);

  return (
    <Layout>
      <SeoHead
        title={`${genreMeta.genre.name} ${
          genreMeta.mediaType === "movie" ? "Movies" : "TV Shows"
        }`}
        description={`Explore ${genreMeta.genre.name} ${
          genreMeta.mediaType === "movie" ? "Movies" : "TV Shows"
        }`}
      />
      <Slider sliderItems={genreDataState.results.slice(0, 4)} />
      <div className="py-8 flex flex-wrap gap-4">
        {genreDataState.results.slice(4).map((data) => (
          <SingleItem key={data.id} item={parseSingleItemData(data)} />
        ))}
        <InfiniteScroll
          setDataState={setGenreDataState}
          tmdbQueryString={tmdbQueryString}
        />
      </div>
    </Layout>
  );
};

export default Genre;
