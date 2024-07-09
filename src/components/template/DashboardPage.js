import styles from "@/template/DashboardPage.module.css";
const DashboardPage = ({ createdAt }) => {
  return (
    <div className={styles.container}>
      <h3>سلام👋</h3>
      <p>آگهی های خود را ثبت کنید تا هزاران نفر آن را مشاهده کنند</p>
      <div className={styles.createdAt}>
        <p>تاریخ عضویت:</p>
        <span>{new Date(createdAt).toLocaleDateString("fa-IR")}</span>
      </div>
    </div>
  );
};
//dalil estefade az JSON.stringify ine ke chon agar khode createdAt ro benevisim ye object behemoon mide dar surati ke ma object nemikhaim. baraye in moshkel az in ravesh estefade mikonim.
//vali chon ma tarikh ro be irani mikhaim miaim az toLocalString estefade mikonim.dar inja in ebarat khodesh stringify mishe va ehtiaji nist ke manand khat bala amal konim.
export default DashboardPage;
