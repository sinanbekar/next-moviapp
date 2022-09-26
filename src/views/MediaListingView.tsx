import Layout from "@/layouts/Layout";
import Slider from "@/components/Slider";
import SingleItem from "@/components/SingleItem";
import { parseSingleItemData } from "@/helpers/movi";
import { Movies, TvShows } from "@/types/tmdb/popular";
import MediaInfiniteScroll from "@/components/MediaInfiniteScroll";

type MediaListingViewProps = {
  mediaData: Movies | TvShows;
  tmdbQueryString: string;
};

function MediaListingView({
  mediaData,
  tmdbQueryString,
}: MediaListingViewProps) {
  return (
    <>
      <Layout>
        <Slider sliderItems={mediaData.results.slice(0, 4)} />
        <MediaInfiniteScroll
          mediaData={mediaData}
          tmdbQueryString={tmdbQueryString}
        >
          {(mediaDataState) => (
            <div className="my-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {mediaDataState.results.slice(4).map((data) => (
                <SingleItem key={data.id} item={parseSingleItemData(data)} />
              ))}
            </div>
          )}
        </MediaInfiniteScroll>
      </Layout>
    </>
  );
}

export default MediaListingView;
