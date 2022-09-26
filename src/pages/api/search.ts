import { fullDateToYear, slugify } from "@/helpers/generic";
import { TMDB, TMDBError } from "@/lib/tmdb";
import { SearchItem } from "@/types/parsed-tmdb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function searchApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query?.q) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, results: [] }));
  }

  const searchResults = await TMDB.searchMulti(req.query.q as string);

  const results: SearchItem[] = searchResults.results.reduce(
    (result, item) =>
      item.media_type === "movie"
        ? result.push({
            id: item.id,
            title: item.title,
            mediaType: "movie",
            redirectUrl: `/movie/${item.id}-${slugify(item.title)}`,
            year: fullDateToYear(item.release_date),
            posterUrl: item.poster_path
              ? TMDB.posterPathToAbsoluteUrl(item.poster_path)
              : TMDB.posterDefaultUrl,
          }) && result
        : item.media_type === "tv"
        ? result.push({
            id: item.id,
            title: item.name,
            mediaType: "tv",
            redirectUrl: `/tv/${item.id}-${slugify(item.name)}`,
            year: fullDateToYear(item.first_air_date),
            posterUrl: item.poster_path
              ? TMDB.posterPathToAbsoluteUrl(item.poster_path)
              : TMDB.posterDefaultUrl,
          }) && result
        : result,
    []
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: true, results }));
}
