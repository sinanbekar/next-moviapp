import { Movies, TvShows } from "@/types/tmdb/popular";
import React from "react";
import useRequest from "./useRequest";

type Props = {
  mediaData: Movies | TvShows;
  tmdbQueryString: string;
};

const useTMDBInfiniteFetch = ({ mediaData, tmdbQueryString }: Props) => {
  const [mediaDataState, setMediaDataState] = React.useState<Movies | TvShows>(
    mediaData
  );

  React.useEffect(() => {
    setMediaDataState(mediaData);
  }, [mediaData]);

  const [page, setPage] = React.useState(1);
  const [tmdbQueryStringState, setTmdbQueryStringState] =
    React.useState(tmdbQueryString); // (SWR does additional request when tmdbQueryString changes with old page value)

  React.useEffect(() => {
    setPage(1);
    setTmdbQueryStringState(tmdbQueryString);
  }, [tmdbQueryString]);

  const loadMore = () => setPage((page) => page + 1);

  const tmdbApiEndpoint = `/api/tmdb?${tmdbQueryStringState}&page=${page}`;

  const { data, error, isLoading } = useRequest<Movies | TvShows>(
    page !== 1 ? tmdbApiEndpoint : null
  );

  const hasMore = data ? data.total_pages > page : true;

  React.useEffect(() => {
    if (
      data &&
      page !== 1 &&
      data.results?.length > 0 &&
      data.total_pages > page
    ) {
      /*@ts-ignore*/
      setMediaDataState((prevState) => ({
        ...prevState,
        results: [...prevState.results, ...data.results],
      }));
    }
  }, [data, page]);

  return {
    mediaDataState,
    loadMore,
    hasMore,
  };
};

export default useTMDBInfiniteFetch;
