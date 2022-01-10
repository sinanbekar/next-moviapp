import React from "react";
import Header from "@/components/Header";
import MetaContainer from "@/components/MetaContainer";
import Modal from "@/components/Modal";
import { useRouter } from "next/router";
import Cast from "@/components/Cast";
import { DetailPageData } from "@/types/parsed-tmdb";
import LayoutWithoutSidebar from "./LayoutWithoutSidebar";

const DetailPage: React.FC<{ parsedData: DetailPageData }> = ({
  parsedData,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();

  const watchTrailerHandle = (e: React.FormEvent<HTMLInputElement>) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, showTrailerModal: true },
      },
      undefined,
      { shallow: true }
    );
    setShowModal(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    if (!router.isReady) return;
    if (router.query.showTrailerModal) {
      setShowModal(true);
    }
  }, [router.isReady]);

  return (
    <>
      <LayoutWithoutSidebar>
        <div
          className="bg-cover bg-no-repeat bg-center lg:rounded-3xl shadow-2xl"
          style={{
            backgroundImage: "url(" + parsedData.backgroundImageUrl + ")",
          }}
        >
          <div
            className="lg:rounded-3xl"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(10.98%, 7.84%, 5.10%, 1.00) 150px, rgba(10.98%, 7.84%, 5.10%, 0.84) 100%)",
            }}
          >
            <div className="flex lg:py-8 lg:px-10 lg:pb-0 py-4">
              <div className="hidden lg:block">
                <img
                alt={parsedData.title}
                  className="max-w-[18rem] shadow-2xl rounded-xl object-cover"
                  src={parsedData.posterImageUrl}
                />
              </div>
              <div className="pl-4 lg:pl-10">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="lg:text-4xl inline-block text-xl font-bold">
                      {parsedData.title}
                    </h2>
                    <span className="opacity-75 px-2 text-2xl font-semibold">
                      (
                      {parsedData.isEnded &&
                      parsedData.year !== parsedData.endYear
                        ? `${parsedData.year} - ${parsedData.endYear}`
                        : parsedData.year}
                      )
                    </span>
                  </div>
                </div>

                <MetaContainer
                  watchTrailerHandle={watchTrailerHandle}
                  detailPageData={parsedData}
                />
              </div>
            </div>
            <Cast castData={parsedData.castData} />
          </div>
        </div>
      </LayoutWithoutSidebar>

      <Modal
        title={`${parsedData.title} Trailer`}
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {parsedData.trailerUrl && (
          <iframe className="w-full h-96 py-4" src={parsedData.trailerUrl} />
        )}
      </Modal>
    </>
  );
};

export default DetailPage;
