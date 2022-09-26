import React from "react";

const useScroll = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isScrollableToLeft, setIsScrollableToLeft] = React.useState(false);
  const [isScrollableToRight, setIsScrollableToRight] = React.useState(false);

  const scrollToRight = () => {
    if (ref.current) {
      ref.current.scrollLeft += ref.current.offsetWidth;
    }
  };

  const scrollToLeft = () => {
    if (ref.current) {
      ref.current.scrollLeft -= ref.current.offsetWidth;
    }
  };

  const checkIsScrollableToRight = () =>
    ref.current
      ? ref.current.scrollWidth > ref.current.clientWidth && // initial check
        Math.ceil(ref.current.scrollLeft) <
          ref.current.scrollWidth - ref.current.clientWidth // check if we hit the max
      : false;

  const checkIsScrollableToLeft = () =>
    ref.current ? ref.current.scrollLeft > 0 : false;

  const handleScroll = () => {
    setIsScrollableToLeft(checkIsScrollableToLeft());
    setIsScrollableToRight(checkIsScrollableToRight());
  };

  React.useEffect(() => {
    setIsScrollableToLeft(checkIsScrollableToLeft());
    setIsScrollableToRight(checkIsScrollableToRight());
  }, []);

  return {
    ref,
    isScrollableToLeft,
    isScrollableToRight,
    handleScroll,
    scrollToLeft,
    scrollToRight,
  };
};

export default useScroll;
