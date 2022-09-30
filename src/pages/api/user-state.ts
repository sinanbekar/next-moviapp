import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { MediaType, UserStateCollection } from "@/types/general";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const mediaId = Number(req?.query?.mediaId ?? 0);
  const mediaType = req?.query?.mediaType as `${MediaType}` | undefined;

  if (
    isNaN(mediaId) ||
    mediaId === 0 ||
    !mediaType ||
    !(mediaType === MediaType.Movie || mediaType === MediaType.TV)
  ) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const userDocRef = doc(db, "users", session.user.id);
  const favoritesCollectionRef = collection(
    userDocRef,
    UserStateCollection.Favorites
  );
  const watchlistCollectionRef = collection(
    userDocRef,
    UserStateCollection.Watchlist
  );

  // media can be same id in TMDB API depending media type
  const favoritesMediaDocRef = doc(
    favoritesCollectionRef,
    `${mediaType}-${mediaId}`
  );

  const watchlistMediaDocRef = doc(
    watchlistCollectionRef,
    `${mediaType}-${mediaId}`
  );

  if (req.method === "GET") {
    const isInFavorites = (await getDoc(favoritesMediaDocRef)).exists();
    const isInWatchlist = (await getDoc(watchlistMediaDocRef)).exists();

    res.status(200).json({
      mediaId,
      mediaType,
      isInFavorites,
      isInWatchlist,
    });
  } else {
    console.error(
      `Unsupported method type ${req.method} made to endpoint ${req.url}`
    );
    res.status(404).end();
  }
}
