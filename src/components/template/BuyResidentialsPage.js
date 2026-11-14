import Card from "@/module/Card";
import SideBar from "@/module/Sidebar";
import SearchOverlay from "@/module/SearchOverlay";
import styles from "@/template/BuyResidentialsPage.module.css";

const BuyResidentialsPage = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <SideBar />
      </div>
      <div className={styles.main}>
        <SearchOverlay />
        {data.length ? null : (
          <p className={styles.text}>هیچ آگهی ثبت نشده است</p>
        )}
        {data.map((profile) => (
          <Card key={profile._id} data={profile} />
        ))}
      </div>
    </div>
  );
};

export default BuyResidentialsPage;
