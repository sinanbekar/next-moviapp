import React from "react";

import SearchBox from "@/components/SearchBox";
import Link from "next/link";
import { getRouteData } from "@/helpers/movi";
import { useRouter } from "next/router";
import { BsPersonCircle } from "react-icons/bs";
import LoginRegisterModal from "@/components/LoginRegisterModal";
import { useUser } from "@/features/auth/authHooks";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authActions";
import { auth } from "@/app/firebase";
import { BiLogOut, BiMovie, BiStar, BiUser } from "react-icons/bi";
import { AiOutlineMenu } from "react-icons/ai";
import useOnClickOutside from "@/hooks/useOnClickOutside";

const Header: React.FC = () => {
  const router = useRouter();
  const { isMoviesPage, isTvPage } = getRouteData(router);
  const [showNavi, setShowNavi] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const dispatch = useDispatch();
  const user = useUser();
  const ref = useOnClickOutside(() => setShowUserDropdown(false));

  const UserDropdown: React.FC<{ isMobile?: boolean }> = ({
    isMobile = false,
  }) => {
    return (
      <div className="flex">
        <div
          onClick={() => {
            setShowUserDropdown(!showUserDropdown);
            setShowNavi(false);
          }}
          className="flex justify-center items-center space-x-3 cursor-pointer"
        >
          {auth.currentUser?.photoURL ? (
            <img
              alt={user.data.displayName ?? ""}
              className="rounded-full"
              referrerPolicy="no-referrer"
              src={auth.currentUser.photoURL}
              width={32}
              height={32}
            />
          ) : (
            <BsPersonCircle className={isMobile ? "text-2xl" : "text-3xl"} />
          )}
        </div>
        <div
          ref={ref}
          className={`
              ${
                !showUserDropdown ? "hidden" : ""
              } absolute left-0 lg:left-auto lg:right-0 w-full lg:w-96 p-3 my-1 top-14 lg:top-10 bg-movidark rounded-lg
            `}
        >
          <div className="pb-4 pt-2 px-2">
            <div className="flex gap-3">
              {auth.currentUser?.photoURL ? (
                <img
                alt={user.data.displayName ?? ""}
                  referrerPolicy="no-referrer"
                  src={auth.currentUser.photoURL}
                  width={64}
                  height={64}
                />
              ) : (
                <BsPersonCircle className="text-5xl" />
              )}
              <div className="flex flex-col">
                <span className="font-semibold">
                  {auth.currentUser?.displayName}
                </span>
                <span className="text-xs opacity-75">
                  {auth.currentUser?.email}
                </span>
              </div>
            </div>
          </div>
          <ul className="opacity-90">
            <li>
              <Link href="/profile">
                <a>
                  <div className="opacity-90 p-3 flex items-center gap-4">
                    <BiUser className="text-xl" />
                    <span>Profile</span>
                  </div>
                </a>
              </Link>
            </li>

            <li>
              <a>
                <div className="opacity-40 cursor-not-allowed p-3 flex items-center gap-4">
                  <BiStar className="text-xl" />
                  <span>Favorites</span>
                </div>
              </a>
            </li>

            <li>
              <a>
                <div className="opacity-40 cursor-not-allowed p-3 flex items-center gap-4">
                  <BiMovie className="text-xl" />
                  <span>Watchlist</span>
                </div>
              </a>
            </li>

            <li className="my-4 border"></li>

            <li className="flex items-center gap-4 p-3 font-medium">
              <BiLogOut className="text-xl -ml-1" />
              <button
                className="ml-1"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(logout());
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-20 bg-movidark w-full flex flex-col justify-center">
      <div className="flex container lg:max-w-full mx-auto p-4 lg:py-1 flex-wrap lg:flex-nowrap items-center">
        <div className="w-5/12 lg:w-1/6 overflow-hidden">
          <div className="ml-2 lg:ml-8 tracking-[0.3rem] lg:text-2xl uppercase">
            <Link href="/movies">Moviapp</Link>
          </div>
        </div>
        <div className="w-4/12 lg:hidden"></div>

        <div className="w-3/12 flex justify-end gap-x-4 lg:hidden">
          <div>
            {!user.loading && user.authentication === true && (
              <UserDropdown isMobile={true} />
            )}
          </div>

          <div className="flex flex-row">
            <button
              onClick={() => {
                setShowNavi(!showNavi);
                setShowUserDropdown(false);
              }}
            >
              <AiOutlineMenu className="text-xl" />
            </button>
          </div>
        </div>

        <div className="lg:w-2/12 -m-1 lg:ml-6 lg:my-0">
          <SearchBox />
        </div>

        <div
          className={`w-full lg:w-8/12 lg:opacity-100 lg:h-auto ${
            !showNavi ? "opacity-0 h-0 overflow-hidden" : ""
          } lg:block pt-2 lg:pt-0 transition duration-500 ease-in-out"`}
        >
          <div className="px-2 lg:px-0">
            <nav className="w-full" role="navigation">
              <ul className="lg:flex justify-end flex-1 items-center">
                <li
                  className={`inline-block w-full ${
                    isMoviesPage ? "font-semibold" : "opacity-75"
                  } lg:px-4 py-2 lg:py-0 lg:text-right`}
                >
                  <Link href="/movies">Movies</Link>
                </li>

                <li
                  className={`inline-block w-full ${
                    isTvPage ? "font-semibold" : "opacity-75"
                  } lg:px-4 py-2 lg:py-0 lg:text-right`}
                >
                  <Link href="/tv">TV Shows</Link>
                </li>

                <li className="hidden lg:inline-block w-full opacity-30 font-semibold lg:px-4 py-2 lg:py-0 lg:text-right">
                  <span className="cursor-not-allowed">Discover</span>
                </li>

                <li className="inline-block lg:flex w-full lg:justify-end font-semibold lg:px-4 py-2 lg:py-0">
                  {!user.loading && user.authentication === true ? (
                    <div className="lg:block hidden">
                      <UserDropdown />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setShowNavi(false);
                        }}
                      >
                        Sign In
                      </button>
                      <LoginRegisterModal
                        showModal={showLoginModal}
                        setShowModal={setShowLoginModal}
                      />
                    </>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
