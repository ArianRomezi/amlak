import os
import json
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
from pymongo import MongoClient

# اتصال به دیتابیس MongoDB (می‌توانید URI خود را جایگزین کنید)
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://arian:qFsJy5gPbqsIX2Bs@cluster0.uj9fsm2.mongodb.net/real-state?retryWrites=true&w=majority")

def fetch_profiles_from_db():
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client.get_database()
        profiles = list(db.profiles.find({"published": True}, {"_id": 1, "category": 1, "price": 1, "location": 1, "amenities": 1}))
        client.close()
        return profiles
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}. Using synthetic training data for academic demonstration.")
        return []

def generate_synthetic_dataset():
    """تولید دیتای آموزشی استاندارد برای ارائه دانشگاهی در صورت خالی بودن دیتابیس"""
    np.random.seed(42)
    n_samples = 1000
    
    # ویژگی‌ها: [category_match, price_diff_ratio, location_match, shared_amenities_count]
    X = np.random.rand(n_samples, 4)
    X[:, 1] = X[:, 1] * 0.8  # تفاوت قیمت بین 0 تا 80 درصد
    X[:, 3] = np.random.randint(0, 5, size=n_samples) # تعداد امکانات مشترک
    
    # قانون هدف: اگر دسته‌بندی و لوکیشن یکی باشند و تفاوت قیمت کم باشد، احتمال پیشنهاد (برچسب 1) بالا می‌رود
    y = ((X[:, 0] > 0.5) & (X[:, 2] > 0.5) & (X[:, 1] < 0.3)).astype(int)
    # اضافه کردن مقداری نویز تصادفی برای واقع‌گرایانه شدن مدل یادگیری ماشین
    noise_indices = np.random.choice(n_samples, size=50, replace=False)
    y[noise_indices] = 1 - y[noise_indices]
    
    return X, y

def main():
    print("--- Starting XGBoost Model Training for Real Estate Recommendation ---")
    
    profiles = fetch_profiles_from_db()
    if len(profiles) < 5:
        print("Using synthetic pairwise property feature dataset for training...")
        X, y = generate_synthetic_dataset()
    else:
        print(f"Loaded {len(profiles)} profiles from MongoDB. Building feature matrix...")
        # استخراج ویژگی‌ها از داده‌های واقعی دیتابیس
        X_list, y_list = [], []
        for i, p1 in enumerate(profiles):
            for j, p2 in enumerate(profiles):
                if i == j:
                    continue
                cat_match = 1.0 if p1.get("category") == p2.get("category") else 0.0
                
                p1_price = float(p1.get("price", 0))
                p2_price = float(p2.get("price", 0))
                price_ratio = abs(p1_price - p2_price) / (p1_price if p1_price > 0 else 1.0)
                
                loc_match = 1.0 if p1.get("location") == p2.get("location") else 0.0
                
                amenities1 = set(p1.get("amenities", []))
                amenities2 = set(p2.get("amenities", []))
                shared_amenities = len(amenities1.intersection(amenities2))
                
                # هدف: اگر هر دو شرط دسته و لوکیشن برقرار باشد و اختلاف قیمت کمتر از 40٪ باشد
                label = 1 if (cat_match == 1.0 and loc_match == 1.0 and price_ratio < 0.4) else 0
                
                X_list.append([cat_match, price_ratio, loc_match, shared_amenities])
                y_list.append(label)
        
        if len(X_list) > 10:
            X = np.array(X_list)
            y = np.array(y_list)
        else:
            X, y = generate_synthetic_dataset()

    # تقسیم داده‌ها به بخش آموزش و تست
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # پیکربندی و آموزش مدل XGBoost Classifier
    model = xgb.XGBClassifier(
        n_estimators=50,
        max_depth=4,
        learning_rate=0.1,
        random_state=42
    )
    
    model.fit(X_train, y_train)

    # ارزیابی مدل برای ارائه به استاد
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    print(f"\n[Model Evaluation Metrics]")
    print(f"-> Accuracy: {acc * 100:.2f}%")
    try:
        auc = roc_auc_score(y_test, y_pred_proba)
        print(f"-> ROC AUC Score: {auc:.4f}")
    except Exception:
        pass
    
    print("\n[Feature Importances]")
    features = ["Category Match", "Price Difference Ratio", "Location Match", "Shared Amenities"]
    for feat, imp in zip(features, model.feature_importances_):
        print(f"- {feat}: {imp:.4f}")

    # ذخیره خروجی مدل به صورت JSON جهت استفاده در بخش جاوااسکریپت پروژه
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/utils"))
    os.makedirs(output_dir, exist_ok=True)
    
    model_json_path = os.path.join(output_dir, "xgb_model.json")
    model.save_model(model_json_path)
    print(f"\nTrained XGBoost model successfully exported to: {model_json_path}")

if __name__ == "__main__":
    main()