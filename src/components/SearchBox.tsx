import React, { Fragment, FocusEvent } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { SearchItem } from "@/types/parsed-tmdb";
import useRequest from "@/hooks/useRequest";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import cn from "classnames";
import ImageWithShimmer from "./ImageWithShimmer";

interface SearchBoxProps {
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

function SearchBox({ onFocus, onBlur }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState<SearchItem>();

  const apiSearchEndpoint = `/api/search?q=${query}`;
  const { data, error, isLoading } = useRequest<{ results: SearchItem[] }>(
    query ? apiSearchEndpoint : null
  );

  React.useEffect(() => {
    if (selectedItem) {
      const cachedItem = selectedItem;
      setSelectedItem(undefined);
      router.push(cachedItem.redirectUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const debouncedOnChange = React.useMemo(() => {
    return debounce((e: any) => {
      setQuery(e.target.value);
    }, 300);
  }, []);

  React.useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <div className="relative w-full max-w-sm">
      <Combobox value={selectedItem} onChange={setSelectedItem}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-white/60"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Search icon</span>
        </div>

        <Combobox.Input
          onChange={debouncedOnChange}
          onFocus={onFocus}
          onBlur={onBlur}
          displayValue={(item: SearchItem) => item?.title}
          className="block w-full rounded-full bg-white/10 p-1 pl-10 text-white/70 ring-white/30 focus:outline-none focus:ring-1 sm:text-sm md:py-1.5"
          placeholder="Find Movies &#38; TV"
        />
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-[80vh] w-full snap-y snap-proximity overflow-hidden overflow-y-auto overflow-x-hidden rounded-md bg-movidark/95 shadow-lg scrollbar hover:overflow-y-auto hover:scrollbar-thin hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-rounded-full">
            {!data?.results || data.results.length === 0 ? (
              query !== "" ? (
                <span className="block p-4 text-sm text-white/70">
                  {data ? "Nothing found" : "Loading..."}
                </span>
              ) : null
            ) : (
              data.results.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    cn("relative cursor-pointer bg-transparent px-4 py-2", {
                      "bg-gray-500/50": active,
                    })
                  }
                  value={item}
                >
                  {() => (
                    <div className="flex items-center gap-x-2">
                      <ImageWithShimmer
                        height={60}
                        width={40}
                        src={item.posterUrl}
                        className="h-[60px] w-[40px] rounded-sm"
                        alt={item.title}
                      />
                      <div className="flex max-w-sm flex-col">
                        <span className="block truncate text-sm">
                          {item.title}
                        </span>
                        {Boolean(item.mediaType) && Boolean(item.year) ? (
                          <span className="block text-sm text-white/50">
                            {item.mediaType === "movie"
                              ? "Movie"
                              : item.mediaType === "tv"
                              ? "TV Show"
                              : ""}
                            &nbsp; • {item.year}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}

export default SearchBox;
