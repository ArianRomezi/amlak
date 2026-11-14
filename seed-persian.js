import "dotenv/config";
import mongoose from "mongoose";
import Profile from "./src/models/Profile.js";
import connectDB from "./src/utils/connectDB.js";

// یا اگر فارسی است، مق اعدادی که مدل قبول می‌کند را بگذارید. اینجا مقادیر نمونه استاندارد قرار می‌دهیم.
const categories = ["apartment", "villa", "store", "office"];
const locations = ["تهران", "اصفهان", "شیراز", "مازندران", "مشهد", "لواسان"];
const allAmenities = [
  "پارکینگ",
  "آسانسور",
  "انباری",
  "بالکن",
  "استخر",
  "باربیکیو",
  "نگهبانی",
];
const realStates = [
  "بنگاه مسکن تهران",
  "املاک مرکزی",
  "خانه طلایی",
  "مشاورین املاک مدرن",
];

async function generatePersianBulkData() {
  try {
    await connectDB();
    console.log("اتصال به دیتابیس برقرار شد...");

    const bulkData = [];
    for (let i = 1; i <= 100; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const realState =
        realStates[Math.floor(Math.random() * realStates.length)];
      const price = Math.floor(Math.random() * 40000000000) + 2000000000; // بین ۲ تا ۴۰ میلیارد تومان

      const amenitiesCount = Math.floor(Math.random() * 4) + 1;
      const amenities = [...allAmenities]
        .sort(() => 0.5 - Math.random())
        .slice(0, amenitiesCount);

      bulkData.push({
        title: `ملک نمونه شماره ${i} در ${location}`,
        description: `این یک ملک نمونه و تستی است که برای ارزیابی سامانه هوش مصنوعی و مدل پیش‌بینی املاک به صورت خودکار ثبت شده است.`,
        category,
        price,
        location,
        amenities,
        realState, // فیلد اجباری جدید
        phone: `0912${Math.floor(1000000 + Math.random() * 9000000)}`, // فیلد اجباری تلفن
        constructionDate: new Date(2015 + Math.floor(Math.random() * 9), 0, 1), // تاریخ ساخت اجباری
        published: true,
      });
    }

    // پاک کردن داده‌های قبلی ناقص (اختیاری)
    await Profile.deleteMany({});

    await Profile.insertMany(bulkData);
    console.log(
      "۱۰۰ ملک نمونه با تمام فیلدهای الزامی با موفقیت به دیتابیس اضافه شدند!",
    );
    process.exit();
  } catch (error) {
    console.error("خطا در تولید انبوه دیتا:", error);
    process.exit(1);
  }
}

generatePersianBulkData();
