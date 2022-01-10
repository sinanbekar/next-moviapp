import Link from "next/link";

import { useRouter } from "next/router";
import { tvGenres, movieGenres } from "@/data/genres";
import { getRouteData } from "@/helpers/movi";
import { slugify } from "@/helpers/generic";

const Sidebar: React.FC = () => {
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

  const SidebarGenresSub = () => {
    return (
      <>
        <h4 className={genreId === 0 ? "text-moviyellow" : ""}>
          <Link
            href={{
              pathname: mediaTypeListPath,
              query: {},
            }}
          >
            All
          </Link>
        </h4>
        {isMoviesPage
          ? movieGenres.map((data) => (
              <h4
                key={data.id}
                className={genreId === data.id ? "text-moviyellow" : ""}
              >
                <Link
                  href={{
                    pathname: genrePathName,
                    query: {
                      slug: `${data.id}-${slugify(data.name)}`,
                      type: currentPageMediaType,
                    },
                  }}
                >
                  {data.name}
                </Link>
              </h4>
            ))
          : isTvPage &&
            tvGenres.map((data) => (
              <h4
                key={data.id}
                className={genreId === data.id ? "text-moviyellow" : ""}
              >
                <Link
                  href={{
                    pathname: genrePathName,
                    query: {
                      slug: `${data.id}-${slugify(data.name)}`,
                      type: currentPageMediaType,
                    },
                  }}
                >
                  {data.name}
                </Link>
              </h4>
            ))}
      </>
    );
  };

  const SidebarMoviesSub = () => {
    return (
      <>
        {!isGenrePage && (
          <h4 className={sortVal === "trending" ? "text-moviyellow" : ""}>
            <Link
              href={{
                pathname: router.pathname,
                query: { ...router.query, sort: "trending" },
              }}
            >
              Trending
            </Link>
          </h4>
        )}

        <h4 className={sortVal === "popular" ? "text-moviyellow" : ""}>
          <Link
            href={{
              pathname: router.pathname,
              query: { ...router.query, sort: "popular" },
            }}
          >
            Popular
          </Link>
        </h4>
      </>
    );
  };

  return (
    <>
      <div>
        <h3 className="text-4xl">
          {isTvPage ? "TV Shows" : isMoviesPage && "Movies"}
        </h3>
      </div>

      <div className="mt-12 text-2xl flex flex-col gap-3">
        <SidebarMoviesSub />
      </div>

      <div className="pt-12">
        <div>
          <h3 className="text-3xl">Genres</h3>
        </div>

        <div className="mt-8 text-2xl flex flex-col gap-3 max-h-96 overflow-y-scroll">
          <SidebarGenresSub />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
