import DashboardCard from "@/module/DashboardCard";
import styles from "@/template/MyProfilesPage.module.css";

const MyProfilesPage = ({ profiles }) => {
  //chon ma darim az ye server component be yek client component darkhast mifrestim behemun warning mide.baraye hale im moshkel data ra manand khate 14 be component pass midim.
  return (
    <div>
      {profiles.length ? null : (
        <p className={styles.text}>هیچ آگهی ثبت نشده است</p>
      )}
      {profiles.map((i) => (
        <DashboardCard key={i._id} data={JSON.parse(JSON.stringify(i))} />
      ))}
    </div>
  );
};

export default MyProfilesPage;
