import { NextApiRequest, NextApiResponse } from "next";
import { TMDB, TMDBError } from "@/lib/tmdb";

export default async function tmdbApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  /* TODO: Refactor */

  const page = req.query?.page ?? 1;
  const genreId = req.query?.genreId ?? null;
  const method = req.query?.method as string;

  try {
    const resData = [
      "discoverMovies",
      "discoverTvShows",
      "getTrendingMovies",
      "getTrendingTvShows",
      "getPopularMovies",
      "getPopularTvShows",
    ].includes(method)
      ? /* @ts-ignore */
        await TMDB[method](page)
      : ["discoverMoviesByGenreId", "discoverTvShowsByGenreId"].includes(method)
      ? /* @ts-ignore */
        await TMDB[method](genreId, page)
      : { results: [] };

    if (resData.results.length === 0) {
      throw new TMDBError();
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(resData));
  } catch (error) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ results: [] }));
  }
}
