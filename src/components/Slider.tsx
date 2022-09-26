import React from "react";
import { useRouter } from "next/router";
import { SingleItemData } from "@/types/parsed-tmdb";
import { parseSingleItemData } from "@/helpers/movi";
import { TMDB } from "@/lib/tmdb";
import WatchTrailerButton from "@/components/WatchTrailerButton";
import { MoviesResult, TvResult } from "@/types/tmdb/popular";
import Image from "next/image";

const Slider: React.FC<{ sliderItems: MoviesResult[] | TvResult[] }> = ({
  sliderItems,
}) => {
  const [index, setIndex] = React.useState(0);
  const timeoutRef: { current: NodeJS.Timeout | null } = React.useRef(null);
  const timeoutVal = 5000;
  const router = useRouter();

  const resetSliderTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSliderClick = (
    _e: React.MouseEvent<HTMLElement>,
    itemData: SingleItemData
  ) => {
    router.push(itemData.redirectSlug);
  };

  const increaseSliderIndex = React.useCallback(() => {
    setIndex(index === sliderItems.length - 1 ? 0 : index + 1);
  }, [sliderItems, index]);

  const decreaseSliderIndex = React.useCallback(() => {
    setIndex(index === 0 ? sliderItems.length - 1 : index - 1);
  }, [sliderItems, index]);

  const setSliderTimeOut = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => increaseSliderIndex(), timeoutVal);
  }, [increaseSliderIndex]);

  React.useEffect(() => {
    resetSliderTimeout();
    setSliderTimeOut();

    return () => {
      resetSliderTimeout();
    };
  }, [setSliderTimeOut]);

  return (
    <div
      onMouseEnter={() => resetSliderTimeout()}
      onMouseLeave={() => setSliderTimeOut()}
      className="mx-auto overflow-hidden"
    >
      <div className="relative">
        <div
          onClick={decreaseSliderIndex}
          className="absolute left-0 z-10 h-full cursor-pointer opacity-50 hover:opacity-100"
        >
          <div className="flex h-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="m-3 h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>
          </div>
        </div>

        <div
          onClick={increaseSliderIndex}
          className="absolute right-0 z-10 h-full cursor-pointer opacity-50 hover:opacity-100"
        >
          <div className="flex h-full items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 m-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
        </div>

        <div
          className="transation whitespace-nowrap duration-1000 ease-in-out"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {sliderItems.map((data) => {
            const itemData = parseSingleItemData(data);
            return (
              <div key={itemData.id} className="inline-block w-full">
                <figure className="relative overflow-visible whitespace-normal">
                  <div className="w-full rounded-lg">
                    <div className="relative h-96 w-full">
                      <Image
                        alt={itemData.title}
                        objectFit="cover"
                        layout="fill"
                        className="w-full rounded-lg opacity-50 shadow-2xl"
                        src={TMDB.backdropPathToAbsoluteUrl(data.backdrop_path)}
                      />
                    </div>
                  </div>
                  <figcaption className="absolute top-0 mt-10 h-full w-full px-8 text-white md:px-20">
                    <div
                      onClick={(e) => {
                        return handleSliderClick(e, itemData);
                      }}
                      className="cursor-pointer"
                    >
                      <div>
                        <h2 className="text-3xl md:text-5xl">
                          {itemData.title}
                        </h2>
                      </div>

                      <div className="pt-8">
                        <p
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          className="w-full opacity-75 md:w-3/5"
                        >
                          {data.overview}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 md:pt-8">
                      <div className="flex items-center gap-5">
                        <WatchTrailerButton
                          redirectUrl={`${itemData.redirectSlug}?showTrailerModal=true`}
                        />
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex w-full justify-center gap-3 py-3">
        {sliderItems.map((_, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              setIndex(idx);
            }}
          >
            <div
              className={
                (index === idx ? "w-6 md:w-8" : "w-3 opacity-50 md:w-4") +
                " h-1.5 rounded-3xl bg-white md:h-2"
              }
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
