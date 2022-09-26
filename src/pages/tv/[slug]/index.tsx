import { GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "@/types/general";
import MediaDetailsView from "@/views/MediaDetailsView";
import { parseDetailPageData, isDetailPageSlug } from "@/helpers/movi";
import { parseSlugToIdAndTitle, SeoHead } from "@/helpers/seo";
import { TMDB, TMDBIdNotFound } from "@/lib/tmdb";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slugData = parseSlugToIdAndTitle(context.params?.slug as string);

  let rawData;
  try {
    if (slugData.id === 0) {
      throw new TMDBIdNotFound();
    }
    rawData = await TMDB.getTvShowDetailsById(slugData.id);
  } catch (e) {
    if (e instanceof TMDBIdNotFound) {
      return {
        notFound: true,
      };
    } else {
      throw e;
    }
  }

  if (!isDetailPageSlug(rawData, slugData)) {
    return {
      notFound: true,
    };
  }

  const detailsData = parseDetailPageData(rawData);

  return {
    props: {
      detailsData,
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
      <MediaDetailsView detailsData={detailsData} />
    </>
  );
}
