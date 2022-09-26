import Link from "next/link";
import cn from "classnames";
import ActiveLink from "./ActiveLink";
import { useRouter } from "next/router";
import { tvGenres, movieGenres } from "@/data/genres";
import { getRouteData } from "@/helpers/movi";
import { slugify } from "@/helpers/generic";
import TMDBAttribution from "./TMDBAttribution";

type GenreLinkProps = {
  genre: {
    id: number;
    name: string;
  };
};

type SortLinkProps = {
  value: string;
};

const Sidebar = () => {
  const router = useRouter();

  const {
    isGenrePage,
    isMoviesPage,
    isTvPage,
    genrePathName,
    genreId,
    sortVal,
    currentPageMediaType,
    mediaTypeListPath,
  } = getRouteData(router);

  const GenreLink = ({ genre }: GenreLinkProps) => (
    <ActiveLink
      activeClassName="text-moviyellow"
      href={genrePathName}
      as={`/genre/${genre.id}-${slugify(genre.name)}/${currentPageMediaType}`}
    >
      <a>{genre.name}</a>
    </ActiveLink>
  );

  const SortLink = ({ value }: SortLinkProps) => (
    <h4 className={cn({ "text-moviyellow": sortVal === value.toLowerCase() })}>
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, sort: value.toLowerCase() },
        }}
      >
        {value}
      </Link>
    </h4>
  );

  return (
    <div className="sticky top-0 hidden h-screen w-[15vw] flex-col gap-y-8 md:flex">
      <h3 className="text-4xl">
        {isTvPage ? "TV Shows" : isMoviesPage && "Movies"}
      </h3>
      <div className="flex flex-col gap-3 text-2xl">
        {!isGenrePage && <SortLink value="Trending" />}
        <SortLink value="Popular" />
      </div>
      <div className="flex flex-col">
        <h3 className="text-3xl">Genres</h3>

        <div className="mt-4 h-[50vh] snap-y snap-proximity overflow-hidden scrollbar hover:overflow-y-scroll hover:scrollbar-thin hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-rounded-full">
          <div className="flex flex-col gap-y-2.5 text-xl">
            <h4
              className={cn({ "text-moviyellow": genreId === 0 }, "snap-start")}
            >
              <Link href={mediaTypeListPath ?? "/movies"}>All</Link>
            </h4>
            {(isMoviesPage ? movieGenres : isTvPage ? tvGenres : []).map(
              (genre) => (
                <span key={genre.id} className="snap-start">
                  <GenreLink genre={genre} />
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 flex flex-col gap-y-3">
        <TMDBAttribution />
      </div>
    </div>
  );
};

export default Sidebar;
