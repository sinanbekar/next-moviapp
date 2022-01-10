import Link from "next/link";
import WatchTrailerButton from "@/components/WatchTrailerButton";
import { DetailPageData, Genre } from "@/types/parsed-tmdb";
import {
  BsBookmarkHeart,
  BsClock,
  BsFillBookmarkFill,
  BsStarFill,
} from "react-icons/bs";
import Image from "next/image";
import { MdPlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";
import React from "react";
import { useUser } from "@/features/auth/authHooks";

interface Props {
  detailPageData: DetailPageData;
  watchTrailerHandle: (e: React.FormEvent<HTMLInputElement>) => void;
}

const MetaContainer: React.FC<Props> = ({
  detailPageData,
  watchTrailerHandle,
}) => {
  const [inFavorites, setInFavorites] = React.useState(false);
  const [inWatchlist, setInWatchlist] = React.useState(false);
  const user = useUser();

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 py-4">
        <span className="px-2 rounded-md opacity-75 border-2 uppercase">
          {detailPageData.isEnded
            ? "Ended"
            : detailPageData.isReleased
            ? "On Air"
            : "Coming Soon"}
        </span>

        <GenreTags genres={detailPageData.genres.slice(0, 4)} />

        {detailPageData.isReleased && detailPageData.rating > 0 && (
          <div className="flex basis-3 sm:basis-auto items-center gap-2">
            <BsStarFill className="text-moviyellow" />
            <span>{detailPageData.rating}</span>
          </div>
        )}

        {detailPageData.duration !== 0 && (
          <div className="flex items-center gap-2">
            <BsClock />
            <span className="text-sm">{detailPageData.durationFormatted}</span>
          </div>
        )}
      </div>
      {detailPageData.trailerUrl && (
        <div className="flex items-center py-4">
          <WatchTrailerButton watchTrailerHandle={watchTrailerHandle} />
          {user.authentication && (
            <div className="flex ml-4 gap-6 items-center">
              {inFavorites ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setInFavorites(false);
                  }}
                >
                  <BsFillBookmarkFill
                    title="Remove from favorites"
                    className="text-2xl"
                  />
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setInFavorites(true);
                  }}
                >
                  <BsBookmarkHeart
                    title="Add to favorites"
                    className="text-2xl"
                  />
                </div>
              )}

              {inWatchlist ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setInWatchlist(false);
                  }}
                >
                  <MdPlaylistAddCheck
                    title="Delete from watchlist"
                    className="text-3xl mt-1"
                  />
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setInWatchlist(true);
                  }}
                >
                  <MdPlaylistAdd
                    title="Add to watchlist"
                    className="text-3xl mt-1"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="py-2 pb-4">
        {detailPageData.platform.length > 0 && (
          <div>
            <span className="text-sm opacity-75 font-bold">Available On</span>
            <div className="py-2 flex gap-2">
              {detailPageData.platform.map((platform) => (
                <div
                  key={platform.id}
                  className="p-2 bg-black rounded-xl transition duration-300 hover:scale-110 ease-in-out"
                >
                  <div className="relative w-10 h-10">
                    <Image
                      layout="fill"
                      title={platform.name}
                      alt={platform.name}
                      src={platform.logoUrl}
                    />
                  </div>
                </div>
              ))}
            </div>
            <small className="text-xs opacity-75">
              *from <b>JustWatch</b>
            </small>
          </div>
        )}
      </div>

      <div>
        {detailPageData.overview && (
          <>
            <span className="font-bold">Overview</span>
            <div>
              <p className="py-2 opacity-70">{detailPageData.overview}</p>
            </div>
          </>
        )}

        {detailPageData.creatorData.length !== 0 && (
          <div className="py-4">
            <span className="font-bold">
              {detailPageData.creatorData.length > 1 ? "Creators" : "Creator"}
            </span>
            <div>
              <span className="opacity-70">{detailPageData.creators}</span>
            </div>
          </div>
        )}

        {detailPageData.directorData.length !== 0 && (
          <div className="py-4">
            <span className="font-bold">
              {detailPageData.directorData.length > 1
                ? "Directors"
                : "Director"}
            </span>
            <div>
              <span className="opacity-70">{detailPageData.directors}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const GenreTags: React.FC<{ genres: Genre[] }> = ({ genres }) => {
  return (
    <div className="flex gap-2 items-center">
      {genres.map((item) => (
        <Link key={item.id} href={item.redirectPath}>
          <a>
            <div
              key={item.id}
              className="py-1 lg:px-4 px-2 rounded-3xl border-2 text-sm border-moviyellow hover:bg-yellow-500 hover:bg-opacity-50 transition ease-in-out duration-200"
            >
              <span>{item.name}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default MetaContainer;
