import React from "react";
import debounce from "lodash.debounce";

type Props = {
  scrollTrigger: number;
};

const useStickyHeader = ({ scrollTrigger }: Props) => {
  const [isSticky, setIsSticky] = React.useState<boolean>(false);

  const checkIsSticky = React.useCallback(() => {
    const distanceY = window.pageYOffset || document.documentElement.scrollTop;

    if (distanceY > scrollTrigger) {
      setIsSticky(true);
    } else if (distanceY <= scrollTrigger) {
      setIsSticky(false);
    }
  }, [scrollTrigger]);

  React.useEffect(() => {
    const debouncedCheckIsSticky = debounce(checkIsSticky, 100);
    window.addEventListener("scroll", debouncedCheckIsSticky);

    return () => window.removeEventListener("scroll", debouncedCheckIsSticky);
  }, [checkIsSticky]);

  return { isSticky };
};

export default useStickyHeader;
