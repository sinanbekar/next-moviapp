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
  Interaction,
} from "@/components/MediaDetails";
import ImageWithShimmer from "@/components/ImageWithShimmer";
import LayoutWithBgFull from "@/layouts/LayoutWithBgFull";
import { Dialog, Transition } from "@headlessui/react";
import { getYearFormatted, pick } from "@/utils/util";
import { MediaDetailsData } from "@/types/tmdb/parsed";

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

            <Interaction
              mediaId={detailsData.id}
              mediaType={detailsData.mediaType}
              trailerUrl={detailsData.trailerUrl}
              setIsModalOpen={setIsModalOpen}
            />

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
