import Layout from "@/layouts/Layout";
import Carousel from "@/components/Carousel";
import SingleItem from "@/components/SingleItem";
import MediaInfiniteScroll from "@/components/MediaInfiniteScroll";
import { MediaListingInitialData } from "@/types/tmdb/parsed";

type Props = {
  initialData: MediaListingInitialData;
  queryData: Record<string, any>;
};

function MediaListingView({ initialData, queryData }: Props) {
  return (
    <>
      <Layout>
        <Carousel items={initialData.results.slice(0, 4)} />
        <MediaInfiniteScroll
          className="my-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          initialData={initialData}
          queryData={queryData}
        >
          {(mediaListData) =>
            mediaListData
              .slice(4)
              .map((data) => <SingleItem key={data.id} item={data} />)
          }
        </MediaInfiniteScroll>
      </Layout>
    </>
  );
}

export default MediaListingView;
