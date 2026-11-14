import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiLeftArrowAlt } from "react-icons/bi";
import styles from "@/module/Card.module.css";
import { sp } from "@/utils/replaceNumber";
import { icons } from "@/constants/icons";

const Card = ({ data: { _id, category, title, location, price } }) => {
  return (
    <article className={styles.container}>
      <div className={styles.icon}>{icons[category]}</div>

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.location}>
        <HiOutlineLocationMarker />
        {location}
      </p>

      <div className={styles.meta}>
        <span className={styles.price}>{sp(price)}</span>
        <span className={styles.currency}>تومان</span>
      </div>

      <Link href={`/buy-residential/${_id}`} className={styles.link}>
        مشاهده آگهی
        <BiLeftArrowAlt />
      </Link>
    </article>
  );
};

export default Card;
