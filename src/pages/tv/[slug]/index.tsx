import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import MediaDetailsView from "@/views/MediaDetailsView";
import { parseDetailPageData, isDetailPageSlug } from "@/helpers/movi";
import { parseSlugToIdAndTitle, SeoHead } from "@/helpers/seo";
import { TMDB, TMDBIdNotFound } from "@/lib/tmdb";
import { TvDetails } from "@/types/tmdb/detail";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slugData = parseSlugToIdAndTitle(context.params?.slug as string);
  let rawData: TvDetails | null = null;

  try {
    rawData = await TMDB.getTvShowDetailsById(slugData.id);
  } catch (e) {
    if (e instanceof TMDBIdNotFound) {
      return {
        notFound: true,
      };
    }
  }

  if (!isDetailPageSlug(rawData, slugData)) {
    return {
      notFound: true,
    };
  }

  const parsedData = parseDetailPageData(rawData);

  return {
    props: {
      detailsData: parsedData,
    },
  };
};

export default function TvShowDetail({
  detailsData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <SeoHead
        title={detailsData.title}
        description={`${detailsData.title} info, rating. ${detailsData.overview}`}
        imgUrl={detailsData.posterImageUrl}
      />
      <MediaDetailsView {...{ detailsData }} />
    </>
  );
}
