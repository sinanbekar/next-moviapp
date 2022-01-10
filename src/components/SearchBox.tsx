import React from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import useRequest from "@/hooks/useRequest";
import { MultiSearch, SearchSub } from "@/types/parsed-tmdb";
import Image from "next/image";

const SearchBox: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const ref = useOnClickOutside((e) => {
    setOpen(false);
  });
  const debounced = useDebouncedCallback((value) => {
    setTerm(value);
  }, 300);

  const SearchBoxContainer: React.FC = ({ children }) => {
    return (
      <div
        ref={ref}
        className="absolute left-0 lg:left-auto w-full lg:w-[35rem] z-40 min-h-96 bg-movidark rounded-b-3xl"
      >
        {children}
      </div>
    );
  };

  const apiSearchEndpoint = `/api/search?q=${term}`;
  const { data, error, isLoading } = useRequest<{ results: MultiSearch }>(
    term ? apiSearchEndpoint : null
  );

  const SearchSubContainer: React.FC<{ mediaType: string }> = ({
    mediaType,
  }) => {
    return (
      <div>
        <span className="text-moviyellow">
          {mediaType === "movie" ? "Movies" : "TV Shows"}
        </span>
        <div className="py-2">
          <div className="flex flex-wrap gap-2">
            {data &&
            (mediaType === "movie"
              ? data.results.movies.length > 0
              : data.results.tvShows.length > 0)
              ? (mediaType === "movie"
                  ? data.results.movies.slice(0, 6)
                  : data.results.tvShows.slice(0, 6)
                ).map((data) => {
                  return <SearchSingleItem key={data.id} itemData={data} />;
                })
              : "Not Found"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-3 opacity-70">
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            debounced(e.target.value);
            if (e.target.value) {
              if (!open) {
                setOpen(true);
              }
            } else {
              setOpen(false);
            }
          }}
          className="border-none bg-transparent outline-none"
          placeholder="Search a movie or tv show..."
          type="search"
        />
      </div>
      <div className={`lg:relative ${!open ? "hidden" : ""}`}>
        <SearchBoxContainer>
          {error || isLoading ? (
            <div className="mx-auto p-5 flex h-1/4 w-full justify-center items-center">
              <h2>
                {error
                  ? "An error has occurred "
                  : isLoading
                  ? "Loading..."
                  : ""}
              </h2>
            </div>
          ) : data ? (
            <div
              className={`${!open ? "hidden" : ""} flex p-8 ${
                data.results.movies.length > data.results.tvShows.length
                  ? "flex-col"
                  : "flex-col-reverse"
              }`}
            >
              <SearchSubContainer mediaType="movie" />
              <SearchSubContainer mediaType="tv" />
            </div>
          ) : null}
        </SearchBoxContainer>
      </div>
    </>
  );
};

const SearchSingleItem: React.FC<{ itemData: SearchSub }> = ({ itemData }) => {
  return (
    <div className="bg-gray-400 bg-opacity-25 w-[calc(50%-0.5rem)] rounded-r-xl">
      <Link href={itemData.redirectUrl}>
        <a>
          <div className="flex">
            <div className="w-14 h-20 relative">
              <Image alt={itemData.title} layout="fill" objectFit="cover" src={itemData.posterUrl} />
            </div>

            <div className="px-4 pt-2 truncate">
              <h5 className="">{itemData.title}</h5>
              <span className="opacity-75">{itemData.year}</span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default SearchBox;
