import Tooltip from "@/components/Tooltip";
import { MediaType } from "@/types/general";
import { fetcher } from "@/utils/util";
import React from "react";
import useSWR from "swr";
import cn from "classnames";
import { useSession, signIn } from "next-auth/react";

type Props = {
  mediaId: number;
  mediaType: `${MediaType}`;
  trailerUrl?: string | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Interaction = ({
  mediaId,
  mediaType,
  trailerUrl,
  setIsModalOpen,
}: Props) => {
  const { data: session, status } = useSession();

  const { data, mutate, error } = useSWR<{
    mediaId: number;
    mediaType: string;
    isInFavorites: boolean;
    isInWatchlist: boolean;
  }>(
    session
      ? `/api/user-state?mediaType=${mediaType}&mediaId=${mediaId}`
      : null,
    fetcher
  );

  const isLoading = (session && !data && !error) || status === "loading";

  const isInFavorites = data?.isInFavorites;
  const isInWatchlist = data?.isInWatchlist;

  const optimisticToggleItem = async (itemType: "favorites" | "watchlist") => {
    const optimisticData =
      itemType === "favorites"
        ? { ...data!, isInFavorites: !isInFavorites }
        : { ...data!, isInWatchlist: !isInWatchlist };

    const request = async () => {
      const method = (itemType === "favorites" ? isInFavorites : isInWatchlist)
        ? "DELETE"
        : "PUT";

      const response = await fetch(`/api/${itemType}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, mediaId }),
      });

      return response.ok ? optimisticData : data!;
    };

    try {
      await mutate(request(), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    } catch (e) {
      // fail
      console.log(e);
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      {trailerUrl ? (
        <Tooltip title="Watch trailer">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full p-2 ring-1 ring-white/70 transition hover:ring-2 hover:ring-moviyellow"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="h-5 w-5 scale-125"
              viewBox="0 0 16 16"
            >
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
          </button>
        </Tooltip>
      ) : null}

      <Tooltip
        title={
          !session
            ? "Login to add this media to your favorites"
            : isInFavorites
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        <button
          onClick={() => session ? optimisticToggleItem("favorites") : signIn()}
          className={cn(
            {
              "pointer-events-none cursor-not-allowed opacity-20": isLoading,
              "bg-moviyellow ring-moviyellow": isInFavorites,
              "ring-white/70 hover:ring-moviyellow": !isInFavorites,
            },
            "inline-flex items-center justify-center rounded-full p-2.5 shadow-2xl ring-1 transition hover:ring-2"
          )}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className={cn("h-4 w-4", {
              "fill-movidark": isInFavorites,
            })}
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.178.178 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.178.178 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.178.178 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.178.178 0 0 1-.134-.098L8.16 4.1z"
            />
          </svg>
        </button>
      </Tooltip>

      <Tooltip
        title={
          !session
            ? "Login to add this media to your watchlist"
            : isInWatchlist
            ? "Remove from watchlist"
            : "Add to watchlist"
        }
      >
        <button
          onClick={() => session ? optimisticToggleItem("watchlist") : signIn()}
          className={cn(
            {
              "pointer-events-none cursor-not-allowed opacity-20": isLoading,
              "bg-moviyellow ring-moviyellow": isInWatchlist,
              "ring-white/70 hover:ring-moviyellow": !isInWatchlist,
            },
            "inline-flex items-center justify-center rounded-full p-2 shadow-2xl ring-1 transition hover:ring-2"
          )}
        >
          {isInWatchlist ? (
            <svg
              width="16"
              height="16"
              fill="currentColor"
              className={cn("h-5 w-5 scale-125", {
                "text-movidark": isInWatchlist,
              })}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M14 10H3V12H14V10M14 6H3V8H14V6M3 16H10V14H3V16M21.5 11.5L23 13L16 20L11.5 15.5L13 14L16 17L21.5 11.5Z"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              fill="currentColor"
              className="h-5 w-5 scale-125"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z"
              />
            </svg>
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default Interaction;
