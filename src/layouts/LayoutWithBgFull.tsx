import Footer from "@/components/Footer";
import Header from "@/components/Header";

type Props = {
  children?: React.ReactNode;
  backgroundImage: React.CSSProperties["backgroundImage"];
};

function LayoutWithBgFull({ children, backgroundImage }: Props) {
  return (
    <>
      <div className="relative">
        <Header />
        <div
          className="absolute -top-4 pb-4 -z-50 w-full h-[calc(100%+1rem)] bg-cover bg-left bg-no-repeat blur-[2px]"
          style={{
            backgroundImage,
          }}
        ></div>
        <div className="container mx-auto flex flex-col gap-y-6 p-6 pb-3 lg:gap-y-12 lg:p-12 lg:pb-6">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default LayoutWithBgFull;
