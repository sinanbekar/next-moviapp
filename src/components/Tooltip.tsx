import cn from "classnames";

type Props = {
  title: string;
  direction?: "TOP" | "BOTTOM";
  children: React.ReactNode;
};

const Tooltip = ({ title, direction = "BOTTOM", children }: Props) => {
  return (
    <div className="group relative flex flex-col items-center">
      {children}
      <div
        role="tooltip"
        className={cn(
          "invisible absolute flex flex-col flex-wrap items-center text-center opacity-0 transition-[visibility,opacity] group-hover:visible group-hover:opacity-100",
          {
            "top-0 mt-10": direction === "BOTTOM",
            "bottom-0 mb-10": direction === "TOP",
          }
        )}
      >
        <span className="relative z-10 w-auto whitespace-nowrap rounded-md bg-gray-700 p-1.5 text-xs leading-none text-white shadow-2xl">
          {title}
        </span>
        <div
          className={cn("h-3 w-3 rotate-45 bg-gray-700", {
            "-order-1 -mb-2": direction === "BOTTOM",
            "-mt-2": direction === "TOP",
          })}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;
