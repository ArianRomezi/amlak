import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import MyProfilesPage from "@/template/MyProfilesPage";
import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";

const MyProfiles = async () => {
  await connectDB();

  const session = await getServerSession(authOptions);

  //dar inja az agregate komak migirim ke dar object aval migim bia yek useri ro baraye man peyda kon ke emialesh ba emaili ke az session omade barabare.
  //dar object dovomi migim lookup kon yani begard az modele profiles.ma alan dar modele user hastim be surate local va mikhaim az kharejimun biad va id haro begire va ba ham tatabogh bede.
  //yani _id ke az user miad ro tatabogh bede ba userId ke az profiles miad.
  //dar inja az as estefade shode be manaye inke halake mikhai seyvesh koni be onvane profiles(be esme) savesh kon.
  const [user] = await User.aggregate([
    { $match: { email: session.user.email } },
    {
      $lookup: {
        from: "profiles",
        foreignField: "userId",
        localField: "_id",
        as: "profiles",
      },
    },
  ]);
  return <MyProfilesPage profiles={user.profiles} />;
};

export default MyProfiles;
