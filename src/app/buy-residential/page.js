import BuyResidentialsPage from "@/template/BuyResidentialsPage";

const BuyResidentials = async ({ searchParams }) => {
  //samte server bayad localhost ro benevisim agar site
  //dar in ja in bakhsh dar samte server ast.agar api ha tu file haye ma mojud nabashad rahe zir dorost  ast am dar in ja api ha ra khodemun tose e madim pas behtar ast az in ravesh estefade nakonim.
  const res = await fetch("https://amlak-cyan.vercel.app/api/profile", {
    cache: "no-store",
  });
  const data = await res.json();

  if (data.error) return <h3>مشکلی پیش آمده است</h3>;

  //inja baraye inke shayad data ro bar asas category filter kardan ro handle mikonim.
  let finalData = data.data;
  if (searchParams.category) {
    finalData = finalData.filter((i) => i.category === searchParams.category);
  }
  return <BuyResidentialsPage data={finalData} />;
};

export default BuyResidentials;
