import React from "react";

const useOnClickOutside = (
  handle: (
    e:
      | MouseEvent
      | React.MouseEvent<HTMLElement>
  ) => void) => {
  
  const ref = React.useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      handle(e);
    }
  };

  React.useEffect(() => {
    window.addEventListener("click", handleClickOutside, true);
    return () => {
      window.removeEventListener("click", handleClickOutside, true);
    };
  });

  return ref;
};

export default useOnClickOutside;
