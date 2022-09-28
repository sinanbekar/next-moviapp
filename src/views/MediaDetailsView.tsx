import React, { Fragment } from "react";
import { useRouter } from "next/router";
import {
  MediaBasics,
  Status,
  Genres,
  Rating,
  Overview,
  Properties,
  Cast,
} from "@/components/MediaDetails";
import ImageWithShimmer from "@/components/ImageWithShimmer";
import LayoutWithBgFull from "@/layouts/LayoutWithBgFull";
import { Dialog, Transition } from "@headlessui/react";
import { getYearFormatted, pick } from "../utils/util";
import { MediaDetailsData } from "utils/media-parser";
import Tooltip from "@/components/Tooltip";

interface MediaDetailsViewProps {
  detailsData: MediaDetailsData;
}

function MediaDetailsView({ detailsData }: MediaDetailsViewProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);

  React.useEffect(() => {
    if (router.isReady && Boolean(router.query.showTrailerModal)) {
      setIsModalOpen(true);
      const url = new URL(router.asPath, "http://n"); // dummy base
      const params = new URLSearchParams(url.search);
      params.delete("showTrailerModal");
      url.search = params.toString();
      const newPath = url.pathname + url.search;

      window.history.replaceState(
        {
          ...window.history.state,
          as: newPath,
          url: newPath,
        },
        "",
        newPath
      );
    }
  }, [router.isReady, router.query, router.asPath]);

  return (
    <>
      <LayoutWithBgFull
        backgroundImage={`linear-gradient(to right, rgb(32,32,32) 150px, rgba(60,50,20, 0.64) 70%), url(${detailsData.backdropImageUrl})`}
      >
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="mx-auto h-[calc(clamp(150px,25vw,300px)/(2/3))] w-[clamp(150px,25vw,300px)] min-w-[clamp(150px,25vw,300px)] md:mx-0">
            <ImageWithShimmer
              width="300"
              className="rounded-md object-cover"
              height="450"
              src={detailsData.posterImageUrl}
              alt={detailsData.title}
            />
          </div>
          <div className="flex flex-col gap-y-6 lg:max-w-3xl">
            <MediaBasics
              {...{
                ...pick(detailsData, "duration", "title"),
                yearText: getYearFormatted(
                  pick(detailsData, "year", "endYear", "isEnded")
                ),
              }}
            />
            <div className="flex flex-wrap items-center gap-4">
              <Status {...pick(detailsData, "isEnded", "isReleased")} />
              <Genres genres={detailsData.genres} />
              <Rating {...pick(detailsData, "isReleased", "rating")} />
            </div>

            <div className="flex items-center gap-x-4">
              {detailsData.trailerUrl ? (
                <Tooltip title="Watch trailer">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-full p-2 ring-1 ring-white/70 transition hover:bg-black hover:ring-2 hover:ring-black"
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
                title={true ? "Remove from favorites" : "Add to favorites"}
              >
                <button className="inline-flex items-center justify-center rounded-full p-2.5 ring-1 ring-white/70 transition hover:bg-black hover:ring-2 hover:ring-black">
                  {true ? (
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.178.178 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.178.178 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.178.178 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.178.178 0 0 1-.134-.098L8.16 4.1z"
                      />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.178.178 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.178.178 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.178.178 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.178.178 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.178.178 0 0 0 .134-.098L7.84 4.1z" />
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                    </svg>
                  )}
                </button>
              </Tooltip>

              <Tooltip
                title={true ? "Remove from watchlist" : "Add to watchlist"}
              >
                <button className="inline-flex items-center justify-center rounded-full p-2 ring-1 ring-white/70 transition hover:bg-black hover:ring-2 hover:ring-black">
                  {true ? (
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="h-5 w-5 scale-125"
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
            <Overview overview={detailsData.overview} />
            <Properties {...pick(detailsData, "creator", "director")} />
          </div>
        </div>
        <Cast {...pick(detailsData, "title", "cast")} />
      </LayoutWithBgFull>

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog
          onClose={closeModal}
          className="fixed inset-0 z-50 overflow-y-auto p-4"
        >
          <Transition.Child
            enter="duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-700/75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            className="flex h-full w-full items-center justify-center"
            enter="duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-xl overflow-hidden rounded-xl bg-movidark py-4 px-8 shadow-2xl ring-1 ring-white/5">
              <Dialog.Title className="text-lg font-bold">{`${detailsData.title} Trailer`}</Dialog.Title>
              <button className="absolute right-4 top-4" onClick={closeModal}>
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Close the modal</span>
              </button>
              {detailsData.trailerUrl && (
                <iframe
                  className="h-96 w-full py-4"
                  src={detailsData.trailerUrl}
                />
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default MediaDetailsView;
