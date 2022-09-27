import Footer from "@/components/Footer";
import Header from "@/components/Header";

type Props = {
  children?: React.ReactNode;
};

const LayoutWithoutSidebar = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 lg:p-8">{children}</main>
      <Footer />
    </>
  );
};

export default LayoutWithoutSidebar;
