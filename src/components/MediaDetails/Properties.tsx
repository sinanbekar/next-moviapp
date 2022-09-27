import { DetailPageData } from "@/types/parsed-tmdb";
import Image from "next/future/image";

const Properties = ({
  platform,
  creatorData,
  creators,
  directorData,
  directors,
}: Pick<
  DetailPageData,
  "platform" | "creatorData" | "creators" | "directorData" | "directors"
>) => (
  <>
    {platform.length > 0 && (
      <div className="flex flex-col gap-y-2">
        <span className="text-sm font-bold text-white/70">
          Available On
          <small className="px-2 text-[10px] text-white/70">
            (from <b>JustWatch</b>)
          </small>
        </span>
        <div className="flex gap-x-2">
          {platform.map((platform) => (
            <Image
              key={platform.id}
              className="rounded-md transition duration-300 ease-in-out hover:scale-105"
              width="40"
              height="40"
              title={platform.name}
              alt={platform.name}
              src={platform.logoUrl}
            />
          ))}
        </div>
      </div>
    )}

    <div className="flex max-w-lg justify-between">
      {creatorData.length !== 0 && (
        <div className="flex-1">
          <h3 className="block font-bold">
            {creatorData.length > 1 ? "Creators" : "Creator"}
          </h3>
          <span className="block text-white/70">{creators}</span>
        </div>
      )}

      {directorData.length !== 0 && (
        <div className="flex-1">
          <h3 className="block font-bold">
            {directorData.length > 1 ? "Directors" : "Director"}
          </h3>
          <span className="block text-white/70">{directors}</span>
        </div>
      )}
    </div>
  </>
);

export default Properties;
