import SignupPage from "@/template/SignupPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/api/auth/[...nextauth]/route";

const Signup = async () => {
  //dar inja baraye secure kardan safhe signin haman gune ke dar documente next-auth nevehste ast bayad amal konim.dar inja be error mikorim va baraye hale moshkel bayad be file .env mun 2 ta mored ezafe konim.
  const session = await getServerSession(authOptions);
  //dar in ja migim ke agar karbar vojud dasht boro be safhe asli
  if (session) redirect("/");
  return <SignupPage />;
};

export default Signup;
