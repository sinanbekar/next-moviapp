import { DetailPageData } from "@/types/parsed-tmdb";

const Status = ({
  isEnded,
  isReleased,
}: Pick<DetailPageData, "isEnded" | "isReleased">) => (
  <span className="rounded-md border-2 px-2 uppercase text-white/70">
    {isEnded ? "Ended" : isReleased ? "On Air" : "Coming Soon"}
  </span>
);

export default Status;
