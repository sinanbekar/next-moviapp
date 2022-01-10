import React from "react";
import { Movies, TvShows } from "@/types/tmdb/popular";
import { TMDBResponse } from "@/types/tmdb/generic";
import useRequest from "@/hooks/useRequest";

interface Props {
  setDataState:
    | React.Dispatch<React.SetStateAction<TMDBResponse<Movies>>>
    | React.Dispatch<React.SetStateAction<TMDBResponse<TvShows>>>
    | React.Dispatch<React.SetStateAction<TMDBResponse<Movies | TvShows>>>;
  tmdbQueryString: string;
}

const InfiniteScroll: React.FC<Props> = ({ setDataState, tmdbQueryString }) => {
  const loader = React.useRef(null);
  const [page, setPage] = React.useState(1);
  const [tmdbQueryStringState, setTmdbQueryStringState] =
    React.useState(tmdbQueryString); // (SWR does additional request when tmdbQueryString changes with old page value)

  React.useEffect(() => {
    setPage(1);
    setTmdbQueryStringState(tmdbQueryString);
  }, [tmdbQueryString]);

  const tmdbApiEndpoint = `/api/tmdb?${tmdbQueryStringState}&page=${page}`;

  const { data, error, isLoading } = useRequest<Movies | TvShows>(
    page !== 1 ? tmdbApiEndpoint : null
  );

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: "5px",
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  React.useEffect(() => {
    if (
      data &&
      page !== 1 &&
      data.results?.length > 0 &&
      data.total_pages > page
    ) {
      /*@ts-ignore*/
      setDataState((prevState) => ({
        ...prevState,
        results: [...prevState.results, ...data.results],
      }));
    }
  }, [data]);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((page) => page + 1);
    }
  };

  return (
    <div ref={loader}>
      <span className="opacity-75">Loading...</span>
    </div>
  );
};

export default InfiniteScroll;
