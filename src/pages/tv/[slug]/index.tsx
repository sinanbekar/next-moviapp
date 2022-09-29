import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { InferGetServerSidePropsType } from "@/types/general";
import MediaDetailsView from "@/views/MediaDetailsView";
import * as TMDB from "@/lib/tmdb";
import { TMDBIdNotFound } from "@/lib/tmdb";
import { parseSlugToIdAndTitle } from "@/utils/util";
import { isDetailPageSlug } from "@/lib/route-parser";
import { parseMediaDetailsData } from "@/lib/media-parser";

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

  const detailsData = parseMediaDetailsData(rawData);

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
      <NextSeo
        title={detailsData.title}
        description={`${detailsData.title} info, rating. ${detailsData.overview}`}
        openGraph={{
          images: [
            {
              url: detailsData.posterImageUrl,
              alt: detailsData.title,
            },
          ],
        }}
      />
      <MediaDetailsView detailsData={detailsData} />
    </>
  );
}
