// TODO: remove on next release
//https://github.com/vercel/next.js/pull/40635
export type InferGetServerSidePropsType<T extends (args: any) => any> = Awaited<
  Extract<Awaited<ReturnType<T>>, { props: any }>["props"]
>;

export enum MediaType {
  Movie = "movie",
  TV = "tv",
}

export enum UserStateCollection {
  Favorites = "favorites",
  Watchlist = "watchlist",
}
