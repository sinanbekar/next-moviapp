import useCarousel from "@/hooks/useCarousel";
import { useSwipeable } from "react-swipeable";
import Image from "next/future/image";
import cn from "classnames";
import { MoviesResult, TvResult } from "@/types/tmdb/popular";
import { parseSingleItemData } from "@/helpers/movi";
import { TMDB } from "@/lib/tmdb";
import WatchTrailerButton from "@/components/WatchTrailerButton";
import Link from "next/link";

type Props = {
  sliderItems: MoviesResult[] | TvResult[];
};

const Carousel = ({ sliderItems }: Props) => {
  // TODO: refactor (handle in server side)
  const parsedSliderItems = sliderItems.map((data) => ({
    ...parseSingleItemData(data),
    overview: data.overview,
    backdropUrl: TMDB.backdropPathToAbsoluteUrl(data.backdrop_path),
  }));

  const {
    index,
    setIndex,
    next,
    back,
    resetCarouselTimeout,
    setCarouselTimeout,
  } = useCarousel(parsedSliderItems.length);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: back,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      onMouseEnter={() => resetCarouselTimeout()}
      onMouseLeave={() => setCarouselTimeout()}
      className="mx-auto overflow-hidden"
    >
      <div className="relative">
        <div
          {...handlers}
          className="transation whitespace-nowrap duration-1000 ease-in-out"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {parsedSliderItems.map((data) => {
            return (
              <div key={data.id} className="inline-block w-full">
                <figure className="relative overflow-visible whitespace-normal">
                  <div className="relative h-64 w-full md:h-96">
                    <Image
                      alt={data.title}
                      fill={true}
                      className="pointer-events-none w-full rounded-lg object-cover opacity-50 shadow-2xl blur-[1px]"
                      src={data.backdropUrl}
                    />
                  </div>
                  <figcaption className="pointer absolute top-1/2 -mt-4 -translate-y-1/2 px-10 md:px-24">
                    <Link href={data.redirectSlug}>
                      <a>
                        <span className="text-2xl md:text-5xl">{data.title}</span>
                        <p className="w-full pt-4 text-white/70 line-clamp-2 md:w-3/5 md:line-clamp-3">
                          {data.overview}
                        </p>
                      </a>
                    </Link>
                    <div className="mt-6 md:mt-8">
                      <WatchTrailerButton
                        redirectUrl={`${data.redirectSlug}?showTrailerModal=true`}
                      />
                    </div>
                  </figcaption>
                </figure>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 space-x-3">
          {parsedSliderItems.map(({ id }, idx) => (
            <button
              key={id}
              onClick={() => setIndex(idx)}
              className={cn(
                "h-1.5 rounded-3xl bg-white md:h-2",
                { "w-3 bg-opacity-50 md:w-4": index !== idx },
                {
                  "w-6 md:w-8": index === idx,
                }
              )}
              aria-current={index === idx}
              aria-label={`Go to slide ${idx} of ${parsedSliderItems.length}`}
            ></button>
          ))}
        </div>

        <button
          onClick={() => back()}
          className="group absolute top-0 left-0 z-10 flex h-full cursor-pointer items-center justify-center px-1 opacity-50 focus:outline-none hover:opacity-100 md:px-4"
        >
          <span className="inline-flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-white md:h-8 md:w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          onClick={() => next()}
          className="group absolute top-0 right-0 z-10 flex h-full cursor-pointer items-center justify-center px-1 opacity-50 focus:outline-none hover:opacity-100 md:px-4"
        >
          <span className="inline-flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-white md:h-8 md:w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;