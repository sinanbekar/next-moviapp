import Link from "next/link";
import ConditionalWrapper from "./ConditionalWrapper";
import cn from "classnames";

interface WatchTrailerButtonProps {
  redirectUrl?: string;
  handle?: any;
}

const WatchTrailerButton: React.FC<WatchTrailerButtonProps> = ({
  redirectUrl,
  handle,
}) => {
  const isAnchorLink = Boolean(redirectUrl);

  return (
    <ConditionalWrapper
      condition={isAnchorLink}
      wrapper={(children) => (
        <Link href={redirectUrl!}>
          <a>{children}</a>
        </Link>
      )}
    >
      <button
        {...(handle ? { onClick: handle } : undefined)}
        className={cn(
          {
            "px-2 py-1 md:px-4 md:py-2.5": isAnchorLink,
            "px-2.5 py-1.5": !isAnchorLink,
          },
          "self-start rounded-lg bg-moviyellow/95  shadow-2xl transition duration-300 hover:scale-105"
        )}
      >
        <span
          className={cn("font-semibold text-black/80", {
            "text-sm md:text-lg": isAnchorLink,
          })}
        >
          Watch Trailer
        </span>
      </button>
    </ConditionalWrapper>
  );
};

export default WatchTrailerButton;
