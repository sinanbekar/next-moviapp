type Props = {
  title: string;
  yearText: string;
  duration: string | null;
};

const Basics = ({ title, yearText, duration }: Props) => {
  return (
    <div className="flex flex-col gap-y-1">
      <h1 className="text-xl font-bold md:text-3xl">{title}</h1>
      <div className="flex items-center gap-x-1">
        <h2 className="font-semibold text-white/70">{`${yearText}${
          duration ? ` · ${duration}` : ""
        }`}</h2>
      </div>
    </div>
  );
};

export default Basics;
