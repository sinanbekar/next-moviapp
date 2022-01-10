import Header from "@/components/Header";

const LayoutWithoutSidebar: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container max-w-7xl p-4 lg:p-8 mx-auto">{children}</div>
    </>
  );
};

export default LayoutWithoutSidebar;
