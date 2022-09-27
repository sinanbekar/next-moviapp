import { DetailPageData } from "@/types/parsed-tmdb";
import ImageWithShimmer from "@/components/ImageWithShimmer";
import React from "react";
import cn from "classnames";
import useScroll from "@/hooks/useScroll";

const Cast = ({
  title,
  castData,
}: Pick<DetailPageData, "title" | "castData">) => {
  const {
    ref: scrollRef,
    handleScroll,
    isScrollableToLeft,
    isScrollableToRight,
    scrollToLeft,
    scrollToRight,
  } = useScroll();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Cast of {title}</h2>
        <div className="mr-4 hidden justify-end gap-x-8 md:flex">
          <button
            className={cn(
              "transition-all",
              { "pointer-events-none fill-white/30": !isScrollableToLeft },
              { "fill-white/80 hover:fill-white": isScrollableToLeft }
            )}
            onClick={scrollToLeft}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 34.075 34.075"
              xmlSpace="preserve"
              className="h-6 w-6 "
            >
              <path d="M24.57 34.075a1.964 1.964 0 0 1-1.396-.577L8.11 18.432a1.972 1.972 0 0 1 0-2.79L23.174.578a1.973 1.973 0 1 1 2.791 2.79l-13.67 13.669 13.67 13.669a1.974 1.974 0 0 1-1.395 3.369z" />
            </svg>
            <span className="sr-only">Previous Page</span>
          </button>
          <button
            className={cn(
              "transition-all",
              { "pointer-events-none fill-white/30": !isScrollableToRight },
              { "fill-white/80 hover:fill-white": isScrollableToRight }
            )}
            onClick={scrollToRight}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 34.075 34.075"
              xmlSpace="preserve"
              className="h-6 w-6"
              transform="scale(-1,1)"
            >
              <path d="M24.57 34.075a1.964 1.964 0 0 1-1.396-.577L8.11 18.432a1.972 1.972 0 0 1 0-2.79L23.174.578a1.973 1.973 0 1 1 2.791 2.79l-13.67 13.669 13.67 13.669a1.974 1.974 0 0 1-1.395 3.369z" />
            </svg>
            <span className="sr-only">Next Page</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-6 snap-x snap-mandatory scroll-px-6 overflow-x-auto scroll-smooth scrollbar-none sm:-mx-12 sm:scroll-px-12"
      >
        <div className="inline-block px-6 sm:px-12">
          <ul className="grid auto-cols-min grid-flow-col gap-x-4 p-1 sm:gap-x-8">
            {castData.map((person, idx) => (
              <li
                key={person.id}
                className="flex w-[25vw] snap-start flex-col gap-y-2 focus:outline-none sm:w-[150px]"
              >
                <ImageWithShimmer
                  alt={person.name}
                  src={person.profileImageUrl}
                  tabIndex={0}
                  width="150"
                  height="150"
                  className="h-[25vw] w-full rounded-full object-cover shadow-2xl focus:outline-none focus:ring-4 sm:h-[150px]"
                />
                <div className="flex flex-col text-center">
                  <span
                    title={person.name}
                    className="truncate text-xs font-bold md:text-sm"
                  >
                    {person.name}
                  </span>
                  <span
                    title={person.character}
                    className="truncate text-xs text-white/70"
                  >
                    {person.character}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cast;
