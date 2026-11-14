import styles from "@/template/DetailsPage.module.css";
import { SiHomebridge } from "react-icons/si";
import { AiOutlinePhone } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiCalendarCheck } from "react-icons/bi";
import { e2p, sp } from "@/utils/replaceNumber";
import ItemList from "@/module/ItemList";
import Title from "@/module/Title";
import ShareButton from "@/module/ShareButton";
import { icons } from "@/constants/icons";
import { categories } from "@/constants/string";
import Recommendations from "@/module/Recommendations";
import { getRecommendations } from "@/utils/recommendations";

const DetailsPage = async ({
  data: {
    title,
    location,
    description,
    area,
    amenities,
    rules,
    realState,
    phone,
    price,
    category,
    constructionDate,
  },
  profileId,
}) => {
  let recommendations = { similar: [], alsoViewed: [] };
  if (profileId) {
    recommendations = (await getRecommendations(profileId)) || recommendations;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.main}>
          <section className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.headerTitle}>{title}</h1>
              <span className={styles.headerLocation}>
                <HiOutlineLocationMarker />
                {location}
              </span>
            </div>
          </section>

          <section className={styles.card}>
            <Title>توضیحات</Title>
            <p className={styles.description}>{description}</p>
          </section>

          <section className={styles.card}>
            <Title>متراژ</Title>
            <div className={styles.area}>
              <span className={styles.areaNumber}>{e2p(area)}</span>
              <span className={styles.areaUnit}>متر</span>
            </div>
          </section>

          <section className={styles.card}>
            <Title>امکانات رفاهی</Title>
            <ItemList data={amenities} />
          </section>

          <section className={styles.card}>
            <Title>قوانین</Title>
            <ItemList data={rules} />
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <div className={styles.priceCard}>
              <span className={styles.priceIcon}>{icons[category]}</span>
              <p className={styles.priceCategory}>
                {categories[category]}
              </p>
              <div className={styles.priceRow}>
                <span className={styles.price}>{sp(price)}</span>
                <span className={styles.currency}>تومان</span>
              </div>
              <span className={styles.date}>
                <BiCalendarCheck />
                {new Date(constructionDate).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.realState}>
              <SiHomebridge />
              <p>املاک {realState}</p>
              <span className={styles.realStatePhone}>
                <AiOutlinePhone />
                {e2p(phone)}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.share}>
              <ShareButton />
            </div>
          </div>
        </aside>
      </div>

      <Recommendations
        profileId={profileId}
        similar={recommendations?.similar || []}
        alsoViewed={recommendations?.alsoViewed || []}
      />
    </>
  );
};

export default DetailsPage;
