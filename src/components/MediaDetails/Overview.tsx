import { DetailPageData } from "@/types/parsed-tmdb";

const Overview = ({ overview }: Pick<DetailPageData, "overview">) =>
  overview ? (
    <div className="flex flex-col gap-y-2">
      <h4 className="text-lg font-semibold">Overview</h4>
      <p className="text-white/70">{overview}</p>
    </div>
  ) : (
    <></>
  );

export default Overview;
