import Link from "next/link";
import { MediaDetailsData } from "@/types/tmdb/parsed";

const Genres = ({ genres }: Pick<MediaDetailsData, "genres">) =>
  genres.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {genres.map((item) => (
        <Link key={item.id} href={item.path}>
          <a>
            <div
              key={item.id}
              className="rounded-3xl border-2 border-moviyellow px-3 py-1 text-xs font-semibold transition hover:bg-yellow-500 hover:bg-opacity-50"
            >
              <span>{item.name}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  ) : (
    <></>
  );

export default Genres;
