import type { NextApiRequest, NextApiResponse } from "next";

import {
  doc,
  setDoc,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import * as TMDB from "@/lib/tmdb";
import { MediaType, UserStateCollection } from "@/types/general";
import { pick } from "@/utils/util";
import { getPath, parseMediaDetailsData } from "@/lib/media-parser";
import { Session } from "next-auth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null,
  userStateCollection: UserStateCollection
) => {
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const userDocRef = doc(db, "users", session.user.id);
  const collectionRef = collection(userDocRef, userStateCollection);

  switch (req.method) {
    case "GET": {
      const querySnapshot = await getDocs(collectionRef);
      const collectionData = querySnapshot.docs.map((doc) => doc.data());

      res.status(200).json({
        results: collectionData,
      });
      break;
    }

    case "DELETE":
    case "PUT": {
      const mediaId = Number(req?.body?.mediaId ?? 0);
      const mediaType: `${MediaType}` | null | undefined = req?.body?.mediaType;

      if (
        isNaN(mediaId) ||
        mediaId === 0 ||
        !mediaType ||
        !(mediaType === MediaType.Movie || mediaType === MediaType.TV)
      ) {
        res.status(400).json({ message: "Bad request" });
        return;
      }

      // media can be same id in TMDB API depending media type
      const mediaDocRef = doc(collectionRef, `${mediaType}-${mediaId}`);

      if (req.method === "DELETE") {
        try {
          await deleteDoc(mediaDocRef);
          res.status(204).end();
        } catch (err) {
          console.error(err);
          res.status(500).json({
            message: `There was an error deleting the media from ${userStateCollection}`,
          });
        }
      } else {
        // PUT

        // unfortunately, TMDB does not support querying
        // multiple ids at the same time, currently
        // so we are saving safe (server-side) data to the document

        try {
          const rawMediaData = await (mediaType === MediaType.Movie
            ? TMDB.getMovieDetailsById(mediaId)
            : TMDB.getTvShowDetailsById(mediaId));

          const mediaData = parseMediaDetailsData(rawMediaData);

          await setDoc(mediaDocRef, {
            ...pick(
              mediaData,
              "id",
              "title",
              "mediaType",
              "posterImageUrl",
              "year"
            ),
            path: getPath(mediaData.id, mediaData.title, mediaData.mediaType),
          });

          res.status(201).end();
        } catch (err) {
          console.error(err);
          res.status(500).json({
            message: `There was an error adding the media to ${userStateCollection}`,
          });
        }
      }

      break;
    }

    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
};

export async function favoritesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) {
  return handler(req, res, session, UserStateCollection.Favorites);
}

export async function watchlistHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session | null
) {
  return handler(req, res, session, UserStateCollection.Watchlist);
}
