import Link from "next/link";

import { BsPlayCircle } from "react-icons/bs";

interface WatchTrailerButtonProps {
  redirectUrl?: string;
  watchTrailerHandle?: any;
}

const WatchTrailerButton: React.FC<WatchTrailerButtonProps> = ({
  redirectUrl,
  watchTrailerHandle,
}) => {
  const WatchTrailerButtonByHandler = () => {
    return (
      <button
        onClick={watchTrailerHandle}
        className="p-3 rounded-3xl  transition duration-300 hover:scale-110 ease-in-out bg-moviyellow"
      >
        <div className="flex items-center gap-2 text-black">
          <BsPlayCircle className="text-3xl" />
          <span>Watch Trailer</span>
        </div>
      </button>
    );
  };

  const WatchTrailerButtonByLink = () => {
    return (
      <div className="p-2.5 lg:py-3 md:p-4 rounded-3xl bg-moviyellow transition duration-300 hover:scale-110 ease-in-out">
        <Link href={redirectUrl ?? ""}>
          <a>
            <div className="flex items-center gap-2 text-black">
              <BsPlayCircle className="text-2xl lg:text-3xl" />
              <span className="text-sm lg:text-base">Watch Trailer</span>
            </div>
          </a>
        </Link>
      </div>
    );
  };

  return redirectUrl ? (
    <WatchTrailerButtonByLink />
  ) : watchTrailerHandle ? (
    <WatchTrailerButtonByHandler />
  ) : (
    <></>
  );
};

export default WatchTrailerButton;
