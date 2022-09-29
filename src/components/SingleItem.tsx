import Link from "next/link";
import ImageWithShimmer from "@/components/ImageWithShimmer";
import { MediaSingleItemData } from "@/types/tmdb/parsed";

type Props = {
  item: MediaSingleItemData;
};

const SingleItem = ({ item }: Props) => {
  return (
    <Link href={item.path}>
      <a>
        <div className="relative cursor-pointer overflow-hidden rounded-lg shadow-xl hover:brightness-125">
          <ImageWithShimmer
            alt={item.title}
            src={item.posterImageUrl}
            width="300"
            height="450"
            className="h-auto w-full rounded-lg object-cover"
          />
          <div className="absolute bottom-0 left-0 z-10 flex h-2/3 w-full flex-col justify-end bg-gradient-to-t from-black px-5 py-4">
            <h4 title={item.title} className="truncate font-semibold">
              {item.title}
            </h4>
            <div className="flex items-center justify-between gap-x-1">
              <span className="text-sm font-semibold text-white/70">
                {item.year}
              </span>
              {Boolean(item.rating) && (
                <div className="flex items-center gap-x-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 fill-moviyellow"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span aria-hidden="true" className="text-sm md:text-base">
                    {item.rating}
                    <span className="text-xs text-white/70 md:text-sm">
                      /10
                    </span>
                  </span>
                  <span className="sr-only">Rated {item.rating} out of 10</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default SingleItem;
