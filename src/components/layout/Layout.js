import Footer from "@/layout/Footer";
import Header from "@/layout/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div style={{ minHeight: "700px" }}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
