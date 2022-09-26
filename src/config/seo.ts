import { DefaultSeoProps } from "next-seo";

const siteName = "next-moviapp";
const title = "MoviApp";
const description = "MoviApp, explore & discover movies and TV shows.";
const keywords = [
  "next-moviapp",
  "movies",
  "tv",
  "explore movies",
  "discover tv shows",
];

const seoConfig: DefaultSeoProps = {
  defaultTitle: title,
  titleTemplate: `%s – MoviApp`,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    site_name: siteName,
  },
  additionalMetaTags: [{ name: "keywords", content: keywords.join(",") }],
};

export default seoConfig;
