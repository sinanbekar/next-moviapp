import Link from "next/link";
import { BsStarFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { SingleItemData } from "@/types/parsed-tmdb";
import { getGenreDataFromId, getRouteData } from "@/helpers/movi";
import { slugify } from "@/helpers/generic";

const SingleGenreItem: React.FC<{ genreIds: number[] }> = ({ genreIds }) => {
  const router = useRouter();

  const { genrePathName, currentPageMediaType } = getRouteData(router);
  return (
    <ul className="flex flex-wrap gap-2 overflow-hidden py-2 overflow-y-hidden">
      {genreIds.slice(0, 2).map((genreId) => {
        const genreData = getGenreDataFromId(genreId);
        return (
          genreData && (
            <li
              key={genreData.id}
              className="px-2 py-0.5 rounded-md border-gray-200 border"
            >
              <Link
                href={{
                  pathname: genrePathName,
                  query: {
                    slug: `${genreData.id}-${slugify(genreData.name)}`,
                    type: currentPageMediaType,
                  },
                }}
              >
                {genreData.name}
              </Link>
            </li>
          )
        );
      })}
    </ul>
  );
};

const SingleItem: React.FC<{ item: SingleItemData }> = ({ item }) => {
  return (
    <div className="w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]">
      <div className="relative">
        <Link href={item.redirectSlug}>
          <a>
            <img
              alt={item.title}
              className="object-cover rounded-t-xl max-h-96 w-full"
              src={item.posterUrl}
            />
          </a>
        </Link>

        <div className="absolute bottom-0 pb-1 w-full bg-black bg-opacity-50">
          <div className="flex justify-between px-4 font-semibold">
            <div className="flex items-center gap-2">
              <BsStarFill className="text-moviyellow" />
              <span>{item.rating}</span>
            </div>
            <div>{item.year}</div>
          </div>
        </div>
      </div>
      <div className="text-white py-2 inline-block max-w-full truncate">
        <h4 className="font-bold truncate">
          <Link href={item.redirectSlug}>{item.title}</Link>
        </h4>

        <span className="text-sm opacity-75">
          <SingleGenreItem genreIds={item.genreIds} />
        </span>
      </div>
    </div>
  );
};

export default SingleItem;
