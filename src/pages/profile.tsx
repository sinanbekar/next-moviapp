import SingleItem from "@/components/SingleItem";
import Layout from "@/layouts/LayoutWithoutSidebar";
import { MediaSingleItemData } from "@/types/tmdb/parsed";
import { fetcher } from "@/utils/util";
import { Menu, Tab } from "@headlessui/react";
import { useSession, signIn } from "next-auth/react";
import useSWR from "swr";
import cn from "classnames";
import React from "react";
import Loader from "@/components/Loader";
import { MediaType } from "@/types/general";
import { NextSeo } from "next-seo";

const Profile = () => {
  const tabs = ["watchlist", "favorites"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("google");
    },
  });

  const {
    data: watchlist,
    mutate: mutateWatchlist,
    error: watchlistError,
  } = useSWR<{
    results: MediaSingleItemData[];
  }>(session && activeTab === tabs[0] ? `/api/watchlist` : null, fetcher);

  const {
    data: favorites,
    mutate: mutateFavorites,
    error: favoritesError,
  } = useSWR<{
    results: MediaSingleItemData[];
  }>(session && activeTab === tabs[1] ? `/api/favorites` : null, fetcher);

  const isWatchlistLoading =
    activeTab === tabs[0] && !watchlist && !watchlistError;
  const isFavoritesLoading =
    activeTab === tabs[1] && !favorites && !favoritesError;

  const optimisticRemoveItem = async (
    itemType: "favorites" | "watchlist",
    mediaType: MediaType,
    mediaId: number
  ) => {
    const data = itemType === "favorites" ? favorites : watchlist;

    const optimisticData = {
      ...data,
      results: data!.results.filter(
        (item) => item.id !== mediaId && item.mediaType === mediaType
      ),
    };

    const mutate = itemType === "favorites" ? mutateFavorites : mutateWatchlist;
    const request = async () => {
      const response = await fetch(`/api/${itemType}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mediaType, mediaId }),
      });

      return response.ok ? optimisticData : data!;
    };

    try {
      await mutate(request(), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    } catch (e) {
      // fail
      console.log(e);
    }
  };

  // When rendering client side don't display anything until loading is complete
  if (status === "loading") return null;

  return (
    <>
      <NextSeo title="Profile" />

      <Layout>
        <div className="px-2">
          <h1 className="text-3xl md:text-4xl">Profile</h1>
          <div className="mt-2 text-lg md:text-2xl">
            Welcome Back,{" "}
            <span className="font-bold">{session.user!.name}</span>
          </div>
        </div>

        <div className="w-full px-2 py-10">
          <Tab.Group onChange={(index) => setActiveTab(tabs[index])}>
            <Tab.List className="mx-auto flex max-w-2xl justify-center space-x-1 rounded-xl bg-white/10 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    cn(
                      "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-moviyellow focus:outline-none focus:ring-2",
                      {
                        "bg-movidark text-moviyellow shadow": selected,
                        "text-white/70 hover:bg-white/[0.12] hover:text-white":
                          !selected,
                      }
                    )
                  }
                >
                  <span className="capitalize">{tab}</span>
                </Tab>
              ))}
            </Tab.List>
            <div className="mt-4">
              {isWatchlistLoading || isFavoritesLoading ? (
                <Loader />
              ) : (
                <Tab.Panels>
                  {tabs.map((tab, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={cn("rounded-xl bg-movidark p-3 md:p-5")}
                    >
                      {((tab === tabs[0] ? watchlist : favorites)?.results
                        .length ?? 0) === 0 ? (
                        <span>You have no media in your {tab}.</span>
                      ) : (
                        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
                          {(tab === tabs[0]
                            ? watchlist
                            : favorites
                          )?.results.map((item) => (
                            <div key={item.id} className="group relative">
                              <SingleItem item={item} />

                              <div className="absolute bottom-2 right-2 z-20 text-white">
                                <Menu>
                                  <Menu.Button className="p-2">
                                    <svg
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    </svg>
                                  </Menu.Button>
                                  <Menu.Items className="absolute top-10 right-0 z-40 w-32 rounded-md bg-black shadow-lg ring-1 ring-white/50">
                                    <Menu.Item>
                                      <button
                                        onClick={() =>
                                          optimisticRemoveItem(
                                            tab as any,
                                            item.mediaType as MediaType,
                                            item.id
                                          )
                                        }
                                        className="w-full px-4 py-3 text-start text-xs font-semibold text-white/70 hover:bg-white/20 hover:text-white"
                                      >
                                        Remove from {tab}
                                      </button>
                                    </Menu.Item>
                                  </Menu.Items>
                                </Menu>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              )}
            </div>
          </Tab.Group>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
