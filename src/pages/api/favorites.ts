import {
  doc,
  setDoc,
  collection,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

const FAVORITES_COLLECTION = "favorites";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const userDocRef = doc(db, "users", session.user.id);
  const collectionRef = collection(userDocRef, FAVORITES_COLLECTION);

  switch (req.method) {
    case "GET": {
      const querySnapshot = await getDocs(collectionRef);

      const favorites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json({
        data: favorites,
      });
      break;
    }

    case "DELETE":
    case "PUT": {
      const mediaId = req?.body?.mediaId;
      if (!mediaId) {
        res.status(400).json({ message: "Bad request" });
        return;
      }

      const mediaDocRef = doc(collectionRef, mediaId);

      if (req.method === "DELETE") {
        try {
          await deleteDoc(mediaDocRef);
          res.status(204).end();
        } catch (err) {
          console.error(err);
          res.status(500).json({
            message: `There was an error deleting the media from watchlist`,
          });
        }
      } else {
        // PUT

        // unfortunately, TMDB does not support querying
        // multiple ids at the same time, currently
        // so we are saving safe (server-side) data to the document

        try {
          const mediaData = {};
          throw new Error("Not Implemented"); // TODO
          await setDoc(mediaDocRef, mediaData);
          res.status(201).end();
        } catch (err) {
          console.error(err);
          res.status(500).json({
            message: `There was an error adding the media to watchlist`,
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
}
