import React from "react";
import { useRouter } from "next/router";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
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
    e: React.MouseEvent<HTMLElement>,
    itemData: SingleItemData
  ) => {
    router.push(itemData.redirectSlug);
  };

  const increaseSliderIndex = () => {
    setIndex(index === sliderItems.length - 1 ? 0 : index + 1);
  };

  const decreaseSliderIndex = () => {
    setIndex(index === 0 ? sliderItems.length - 1 : index - 1);
  };

  const setSliderTimeOut = () => {
    timeoutRef.current = setTimeout(() => increaseSliderIndex(), timeoutVal);
  };

  React.useEffect(() => {
    resetSliderTimeout();
    setSliderTimeOut();

    return () => {
      resetSliderTimeout();
    };
  }, [index]);

  return (
    <div
      onMouseEnter={() => resetSliderTimeout()}
      onMouseLeave={() => setSliderTimeOut()}
      className="mx-auto overflow-hidden"
    >
      <div className="relative">
        <div
          onClick={decreaseSliderIndex}
          className="absolute left-0 h-full z-10 cursor-pointer opacity-50 hover:opacity-100"
        >
          <div className="flex h-full justify-center items-center">
            <BsArrowLeft className="m-2 text-sm md:text-3xl" />
          </div>
        </div>

        <div
          onClick={increaseSliderIndex}
          className="absolute right-0 h-full z-10 cursor-pointer opacity-50 hover:opacity-100"
        >
          <div className="flex h-full justify-center items-center">
            <BsArrowRight className="m-2 text-sm md:text-3xl" />
          </div>
        </div>

        <div
          className="whitespace-nowrap transation ease-in-out duration-1000"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {sliderItems.map((data) => {
            const itemData = parseSingleItemData(data);
            return (
              <div key={itemData.id} className="inline-block w-full">
                <figure className="relative whitespace-normal overflow-visible">
                  <div className="w-full rounded-lg">
                    <div className="relative w-full h-96">
                      <Image
                        alt={itemData.title}
                        objectFit="cover"
                        layout="fill"
                        className="rounded-lg shadow-2xl opacity-50 w-full"
                        src={TMDB.backdropPathToAbsoluteUrl(data.backdrop_path)}
                      />
                    </div>
                  </div>
                  <figcaption className="absolute top-0 mt-10 text-white px-8 md:px-20 h-full w-full">
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
                          className="w-full md:w-3/5 opacity-75"
                        >
                          {data.overview}
                        </p>
                      </div>
                    </div>
                    <div className="md:pt-8 pt-4">
                      <div className="flex gap-5 items-center">
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

      <div className="w-full py-3 flex justify-center gap-3">
        {sliderItems.map((_, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              setIndex(idx);
            }}
          >
            <div
              className={
                (index === idx ? "w-6 md:w-8" : "w-3 md:w-4 opacity-50") +
                " h-1.5 md:h-2 bg-white rounded-3xl"
              }
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
