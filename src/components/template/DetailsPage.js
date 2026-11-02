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
          <h1>{title}</h1>
          <span>
            <HiOutlineLocationMarker />
            {location}
          </span>
          <Title>توضیحات</Title>
          <p>{description}</p>
          <Title>امکانات رفاهی</Title>
          <ItemList data={amenities} />
          <Title>قوانین</Title>
          <ItemList data={rules} />
        </div>
        <div className={styles.sidebar}>
          <div className={styles.realState}>
            <SiHomebridge />
            <p>املاک {realState}</p>
            <span>
              <AiOutlinePhone />
              {e2p(phone)}
            </span>
          </div>
          <ShareButton />
          <div className={styles.price}>
            <p>{icons[category]} {categories[category]}</p>
            <p>{sp(price)} تومان</p>
            <p>
              <BiCalendarCheck />
              {new Date(constructionDate).toLocaleDateString("fa-IR")}
            </p>
          </div>
        </div>
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
