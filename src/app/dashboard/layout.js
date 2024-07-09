import DashboardSidebar from "@/layout/DashboardSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";

export const metadata = {
  title: "پنل کاربری املاک",
};
const DashboardLayout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin");

  //inja mikhaim karbar ro begirim pas be data base vasl mishim.
  await connectDB();
  //inja role karbar ro mitunim befahmim chie
  const user = await User.findOne({ email: session.user.email });

  if (!user) return <h3>مشکلی پیش آمده است</h3>;

  return (
    <DashboardSidebar role={user.role} email={user.email}>
      {children}
    </DashboardSidebar>
  );
};

export default DashboardLayout;
