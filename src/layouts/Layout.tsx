import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="mx-auto my-4 flex gap-x-8 px-4 md:px-8 2xl:container">
        <Sidebar />
        <div className="w-full">{children}</div>
      </div>
    </>
  );
}

export default Layout;
