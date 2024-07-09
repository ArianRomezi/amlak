import Profile from "@/models/Profile";
import AddProfilePage from "@/template/AddProfilePage";
import connectDB from "@/utils/connectDB";

//baraye gereftan id az props estefade mikonim ke yek params dakheleshe va az oon profileId ro migirim.
const Edit = async ({ params: { profileId } }) => {
  await connectDB();

  const profile = await Profile.findOne({ _id: profileId });

  if (!profile) return <h3>مشکلی پیش آمده است. لطفا دوباره امتحان کنید...</h3>;

  return <AddProfilePage data={JSON.parse(JSON.stringify(profile))} />;
};

export default Edit;
