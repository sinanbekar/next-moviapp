import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { parseDetailPageData, isDetailPageSlug } from "@/helpers/movi";
import DetailPage from "@/components/DetailPage";
import { parseSlugToIdAndTitle, SeoHead } from "@/helpers/seo";
import { TMDB, TMDBIdNotFound } from "lib/tmdb";
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
      parsedData,
    },
  };
};

export default function TvShowDetail({
  parsedData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <SeoHead
        title={parsedData.title}
        description={`${parsedData.title} info, rating. ${parsedData.overview}`}
        imgUrl={parsedData.posterImageUrl}
      />
      <DetailPage parsedData={parsedData} />
    </>
  );
}
