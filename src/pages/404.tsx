import Header from "@/components/Header";

export default function Error404() {
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <div className="m-auto">
          <div className="-mt-20">
            <span className="text-xl font-light">404 | Content Not Found</span>
          </div>
        </div>
      </div>
    </>
  );
}
