import useStickyHeader from "@/hooks/useStickyHeader";
import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, FocusEvent } from "react";
import ActiveLink from "./ActiveLink";
import { Popover, Transition } from "@headlessui/react";
import SearchBox from "./SearchBox";
import { useSession, signIn, signOut } from "next-auth/react";
import ImageWithShimmer from "./ImageWithShimmer";

const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const { events: routerEvents } = useRouter();
  const { isSticky } = useStickyHeader({ scrollTrigger: 48 });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchFocus = (_e: FocusEvent<HTMLInputElement>) => {
    setIsSearchFocused(true);
    setIsMenuOpen(false);
  };

  const handleSearchBlur = (_e: FocusEvent<HTMLInputElement>) => {
    setIsSearchFocused(false);
  };

  React.useEffect(() => {
    routerEvents.on("routeChangeComplete", closeMenu);
    return () => {
      routerEvents.off("routeChangeComplete", closeMenu);
    };
  }, [routerEvents]);

  return (
    <header className="sticky -top-px z-20 mx-auto 2xl:container">
      <div
        className={cn(
          "bg-movidark/70 px-6 backdrop-blur-sm transition-[margin,padding] md:flex md:items-center md:justify-between",
          { "m-2 rounded-md": !isSticky && !isMenuOpen },
          { "bg-movidark/90 backdrop-blur-lg": isMenuOpen }
        )}
      >
        <div className="flex w-full items-center justify-between gap-x-3 py-2 md:gap-x-0 md:pr-4">
          <div className="flex w-full items-center gap-x-3 md:gap-x-6">
            <Link href="/movies">
              <a
                className={cn(
                  "text-md font-semibold uppercase tracking-[0.1rem] md:text-lg md:tracking-[0.3rem]",
                  {
                    "hidden sm:inline-block": isSearchFocused,
                  }
                )}
              >
                Moviapp
              </a>
            </Link>
            <SearchBox onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
          </div>

          <button
            onClick={toggleMenu}
            className={cn("block md:hidden", {
              "hidden sm:block": isSearchFocused,
            })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <nav
          className={cn(
            {
              "invisible h-0 opacity-0": !isMenuOpen,
            },
            "flex shrink-0 flex-col transition-[opacity,visibility,height] md:visible md:h-auto md:flex-row md:items-center md:opacity-100"
          )}
        >
          <ul className="flex flex-col md:flex-row md:gap-x-12">
            <li>
              <ActiveLink activeClassName="font-bold" href="/movies">
                <a className="block py-2">Movies</a>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink activeClassName="font-bold" href="/tv">
                <a className="block py-2">TV Shows</a>
              </ActiveLink>
            </li>

            <li>
              <span className="block cursor-not-allowed py-2 text-white/30">
                Discover
              </span>
            </li>
          </ul>

          <hr className="my-2 mb-4 opacity-30 md:hidden" />
          <div className="hidden md:ml-8 md:block">
            {!(session && session.user) ? (
              <button
                onClick={() => signIn("google")}
                className="font-semibold"
              >
                Sign In
              </button>
            ) : (
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button className="hidden items-center gap-x-1 md:flex">
                      {session.user!.image && session.user!.name ? (
                        <ImageWithShimmer
                          src={session.user!.image}
                          height={32}
                          width={32}
                          className="rounded-full"
                          alt={session.user!.name}
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={cn(
                          { "rotate-180 transform": open },
                          "h-4 w-4"
                        )}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 top-8 z-10 hidden w-52 rounded-md bg-movidark/95 py-3 md:block">
                        <span className="px-4 font-bold text-white/70">
                          {session.user!.name ?? "user"}
                        </span>

                        <Link href="/profile">
                          <a className="mt-2 inline-block w-full px-4 py-1 text-sm text-white/80 hover:bg-white/20">
                            Profile
                          </a>
                        </Link>
                        <hr className="my-1 opacity-50" />
                        <div
                          onClick={() => signOut()}
                          className="cursor-pointer px-4 py-1 text-sm text-white/80 hover:bg-white/20"
                        >
                          <span>Sign Out</span>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            )}
          </div>

          {/* mobile-only */}
          <div className="flex flex-col pb-4 md:hidden">
            {session && session.user ? (
              <div className="flex flex-col gap-y-4">
                <Link href="/profile">
                  <a className="flex items-center gap-x-2 py-1">
                    {session.user.image && session.user.name ? (
                      <ImageWithShimmer
                        src={session.user.image}
                        height={32}
                        width={32}
                        className="rounded-full"
                        alt={session.user.name}
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-8 w-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-bold text-white/70">
                      {session.user.name ?? "user"}
                    </span>
                  </a>
                </Link>
                <button onClick={() => signOut()} className="flex gap-x-2 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-white/80">
                    Sign Out
                  </span>
                </button>
              </div>
            ) : (
              <div className="mx-auto">
                <button
                  onClick={() => signIn("google")}
                  className="rounded-md bg-moviyellow/80 px-6 py-2 font-semibold text-black"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
