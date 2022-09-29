import { NextApiRequest, NextApiResponse } from "next";
import * as TMDB from "@/lib/tmdb";
import { prepareMediaListData } from "@/utils/media-parser";
import { MediaType } from "@/types/general";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query?.q;

  if (!query) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const rawMediaData = await TMDB.searchMulti(req.query.q as string);

  res.status(200).json(
    prepareMediaListData({
      ...rawMediaData,
      results: rawMediaData.results.filter(
        (item) =>
          item.media_type === MediaType.Movie ||
          item.media_type === MediaType.TV
      ),
    })
  );
}
