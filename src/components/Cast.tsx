import { SingleCast } from "@/types/parsed-tmdb";
import Image from "next/image";

const Cast: React.FC<{
  castData: readonly SingleCast[] | [];
}> = ({ castData }) => {
  return castData.length !== 0 ? (
    <div className="p-4 lg:p-8">
      {/*  <h3 className="py-4 text-xl"></h3> */}
      <ol className="flex gap-4 overflow-x-scroll py-4">
        {castData.map((person: SingleCast) => (
          <li
            key={person.id}
            className="border-gray-50 border-opacity-25 border-4 rounded-md shadow-2xl"
          >
            <div>
              <div className="w-40 h-40 relative">
                <Image
                  alt={person.name}
                  layout="fill"
                  objectFit="cover"
                  src={person.profileImageUrl}
                />
              </div>

              <div className="bg-movidark bg-opacity-50">
                <div className="text-white p-4">
                  <h4 className="font-bold truncate hover:whitespace-normal text-sm">
                    {person.name}
                  </h4>
                  <h6 className="opacity-70 truncate hover:whitespace-normal text-xs">
                    {person.character}
                  </h6>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  ) : (
    <></>
  );
};

export default Cast;
