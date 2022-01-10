import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex">
        <div className="pl-12 pr-4 sticky top-0 mt-8 hidden lg:block w-1/5 h-screen">
          <Sidebar />
        </div>
        <div className="container mx-auto p-4 lg:p-8">{children}</div>
      </div>
    </>
  );
};

export default Layout;
