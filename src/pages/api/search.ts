import { fullDateToYear, slugify } from "@/helpers/generic";
import { TMDB, TMDBError } from "@/lib/tmdb";
import { MultiSearch } from "@/types/parsed-tmdb";
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
  const resData: MultiSearch = searchResults.results.reduce(
    (result, item) =>
      item.media_type === "movie"
        ? result.movies.push({
            id: item.id,
            title: item.title,
            redirectUrl: `/movie/${item.id}-${slugify(item.title)}`,
            year: fullDateToYear(item.release_date),
            posterUrl: item.poster_path
              ? TMDB.posterPathToAbsoluteUrl(item.poster_path)
              : TMDB.posterDefaultUrl,
          }) && result
        : item.media_type === "tv"
        ? result.tvShows.push({
            id: item.id,
            title: item.name,
            redirectUrl: `/tv/${item.id}-${slugify(item.name)}`,
            year: fullDateToYear(item.first_air_date),
            posterUrl: item.poster_path
              ? TMDB.posterPathToAbsoluteUrl(item.poster_path)
              : TMDB.posterDefaultUrl,
          }) && result
        : result,
    {
      tvShows: [],
      movies: [],
    }
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: true, results: resData }));
}
