import DashboardPage from "@/template/DashboardPage";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";

const Dashboard = async () => {
  await connectDB;
  //dar inja ma email ro mikhaim va ba estefade az next-auth mitoonim email ro az session begirim.
  const session = await getServerSession(authOptions);
  const user = await User.findOne({ email: session.user.email });

  return <DashboardPage createdAt={user.createdAt} />;
};

export default Dashboard;
