import { SlugData } from "@/types/generic";
import Head from "next/head";

export const parseSlugToIdAndTitle = (slug: string): SlugData => {
  const id = slug.split("-")[0];
  const title = slug.slice(slug.indexOf("-") + 1);
  return {
    id: Number(id),
    title: title,
  };
};

export const SeoHead: React.FC<{
  title?: string | null;
  description?: string | null;
  imgUrl?: string | null;
}> = ({ title, description, imgUrl }) => {
  const titleN = title ? `${title} - MoviApp` : "MoviApp";
  const desc =
    description || "MoviApp, explore & discover movies and TV shows.";
  return (
    <Head>
      <title>{titleN}</title>
      <meta name="description" content={desc} />
      <meta name="og:title" property="og:title" content={titleN} />
      <meta name="og:description" property="og:description" content={desc} />
      <meta property="og:site_name" content="MoviApp" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={titleN} />
      <meta name="twitter:description" content={desc} />
      {imgUrl && <meta property="og:image" content={imgUrl} />}
      {imgUrl && <meta property="twitter:image" content={imgUrl} />}
    </Head>
  );
};
