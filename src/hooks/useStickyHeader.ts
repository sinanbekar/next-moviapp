import React from "react";

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
    window.addEventListener("scroll", checkIsSticky);

    return () => window.removeEventListener("scroll", checkIsSticky);
  }, [checkIsSticky]);

  return { isSticky };
};

export default useStickyHeader;
