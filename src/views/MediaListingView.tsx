import Layout from "@/layouts/Layout";
import Carousel from "@/components/Carousel";
import SingleItem from "@/components/SingleItem";
import MediaInfiniteScroll from "@/components/MediaInfiniteScroll";
import type { MediaSingleItemData } from "../utils/media-parser";

type MediaListingViewProps = {
  mediaData: MediaSingleItemData[];
  queryData: any; // TODO
};

function MediaListingView({ mediaData, queryData }: MediaListingViewProps) {
  return (
    <>
      <Layout>
        <Carousel items={mediaData.slice(0, 4)} />
        <MediaInfiniteScroll mediaData={mediaData} queryData={queryData}>
          {(mediaDataState) => (
            <div className="my-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {mediaDataState.slice(4).map((data) => (
                <SingleItem key={data.id} item={data} />
              ))}
            </div>
          )}
        </MediaInfiniteScroll>
      </Layout>
    </>
  );
}

export default MediaListingView;
