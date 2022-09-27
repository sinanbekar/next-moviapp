import React from "react";

const useCarousel = (length: number, options = { delay: 5000 }) => {
  const [index, setIndex] = React.useState<number>(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const next = React.useCallback(
    () => setIndex((idx) => (idx + 1) % length),
    [length]
  );

  const back = React.useCallback(
    () => setIndex((idx) => (idx === 0 ? length - 1 : (idx - 1) % length)),
    [length]
  );

  const resetCarouselTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const setCarouselTimeout = React.useCallback(() => {
    timeoutRef.current = setTimeout(next, options.delay);
  }, [next, options.delay]);

  React.useEffect(() => {
    resetCarouselTimeout();
    setCarouselTimeout();

    return () => {
      resetCarouselTimeout();
    };
  }, [index, setCarouselTimeout]);

  return {
    index,
    setIndex,
    next,
    back,
    resetCarouselTimeout,
    setCarouselTimeout,
  };
};

export default useCarousel;
