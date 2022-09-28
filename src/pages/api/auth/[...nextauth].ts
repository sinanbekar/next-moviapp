import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import firebaseConfig from "../../../config/firebase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter(firebaseConfig),
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to base if sign out from /profile page
      if (new URL(url).pathname === "/profile") return baseUrl;
      // Allows relative callback URLs
      else if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token, user }) {
      session.user.id = (token.id || user?.id || token.sub) as string; // NOTE: seems buggy when jwt strategy ¯\_(ツ)_/¯
      return session;
    },
  },
  session: { strategy: "jwt" },
};

export default NextAuth(authOptions);
