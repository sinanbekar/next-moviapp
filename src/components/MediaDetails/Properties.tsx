import { MediaDetailsData } from "@/types/tmdb/parsed";

const Properties = ({
  creator,
  director,
}: Pick<MediaDetailsData, "creator" | "director">) => (
  <div className="flex max-w-lg justify-between">
    {Boolean(creator) && (
      <div className="flex-1">
        <h3 className="block font-bold">Creator</h3>
        <span className="block text-white/70">{creator}</span>
      </div>
    )}

    {Boolean(director) && (
      <div className="flex-1">
        <h3 className="block font-bold">Director</h3>
        <span className="block text-white/70">{director}</span>
      </div>
    )}
  </div>
);

export default Properties;
