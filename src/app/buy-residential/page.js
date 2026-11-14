// import BuyResidentialsPage from "@/template/BuyResidentialsPage";

// const BuyResidentials = async ({ searchParams }) => {
//   //samte server bayad localhost ro benevisim agar site
//   //dar in ja in bakhsh dar samte server ast.agar api ha tu file haye ma mojud nabashad rahe zir dorost  ast am dar in ja api ha ra khodemun tose e madim pas behtar ast az in ravesh estefade nakonim.
//   const res = await fetch("https://amlak-cyan.vercel.app/api/profile", {
//     cache: "no-store",
//   });
//   const data = await res.json();

//   if (data.error) return <h3>مشکلی پیش آمده است</h3>;

//   //inja baraye inke shayad data ro bar asas category filter kardan ro handle mikonim.
//   let finalData = data.data;
//   if (searchParams.category) {
//     finalData = finalData.filter((i) => i.category === searchParams.category);
//   }
//   return <BuyResidentialsPage data={finalData} />;
// };

// export default BuyResidentials;
import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import BuyResidentialsPage from "@/template/BuyResidentialsPage";

const BuyResidentials = async ({ searchParams }) => {
  try {
    await connectDB();

    let profiles = await Profile.find({ published: true }).lean();
    profiles = JSON.parse(JSON.stringify(profiles));

    let finalData = profiles;
    if (searchParams?.category) {
      finalData = finalData.filter((i) => i.category === searchParams.category);
    }

    return <BuyResidentialsPage data={finalData} />;
  } catch (error) {
    // نمایش خطای واقعی روی صفحه برای عیب‌یابی
    return (
      <div style={{ padding: "20px", direction: "rtl", fontFamily: "Tahoma" }}>
        <h2 style={{ color: "red" }}>خطای سیستم:</h2>
        <pre
          style={{
            background: "#f3f4f6",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
      </div>
    );
  }
};

export default BuyResidentials;
