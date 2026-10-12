# تطبيق طبيبي (My Doctor) 🩺

مشروع متكامل لإدارة وحجز مواعيد الأطباء يتكون من تطبيق جوال مبني باستخدام **React Native / Expo** وخادم خلفي مبني باستخدام **Node.js Express & PostgreSQL (Sequelize)**.

---

## 📁 هيكلية المشروع (Project Structure)

```text
my-Doctor-hsoub/
├── mobile/                   # تطبيق الهاتف المحمول (Expo / React Native)
│   ├── assets/               # الأيقونات والصور
│   ├── components/           # المكونات المشتركة
│   ├── config/               # إعدادات الاتصال والـ URLs
│   ├── screens/              # شاشات التطبيق (Home, Doctors, Login, SignUp, etc.)
│   ├── App.js                # نقطة البداية وإدارة التنقل (Navigation)
│   ├── package.json          # حزم واعتماديات الموبايل
│   └── .gitignore            # تجاهل ملفات النظام والحزم
│
├── server/                   # الخادم البرمجي (Backend API)
│   ├── Controller/           # معالجات الطلبات (Auth, Doctors, Profiles)
│   ├── middlewares/          # التحقق من الهوية والصلاحيات والمصادقة
│   ├── models/               # نماذج قاعدة البيانات وعلاقات Sequelize
│   ├── routes/               # المسارات البرمجية للـ API
│   ├── app.js                # الخادم الرئيسي وإعدادات Express
│   ├── .env.example          # قالب المتغيرات البيئية
│   └── package.json          # حزم واعتماديات السيرفر
│
├── .gitignore                # ملف التجاهل الرئيسي للمستودع
└── README.md                 # دليل التشغيل والتثبيت
```

---

## ⚙️ متطلبات التشغيل (Prerequisites)

- **Node.js** (إصدار 18 أو أحدث)
- **PostgreSQL** يعمل على المنفذ `5432`
- تطبيق **Expo Go** على الهاتف (في حال التجربة على جهاز حقيقي) أو متصفح الويب

---

## 🚀 تشغيل الخادم (Server Setup)

1. الانتقال إلى مجلد الخادم:
   ```bash
   cd server
   ```

2. تثبيت الحزم (إن لم تكن مثبتة):
   ```bash
   npm install
   ```

3. تجهيز ملف المتغيرات البيئية (`.env`):
   قم بإنشاء ملف `.env` بناءً على `.env.example`:
   ```env
   PORT=8080
   DB_NAME=mydoctor
   DB_USER=postgres
   DB_PASS=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   ```

4. تشغيل السيرفر:
   ```bash
   npm run start
   ```
   سيعمل السيرفر افتراضياً على: `http://localhost:8080` وسيقوم بمزامنة الجداول تلقائياً مع PostgreSQL.

---

## 📱 تشغيل تطبيق الجوال (Mobile Setup)

1. الانتقال إلى مجلد الموبايل:
   ```bash
   cd mobile
   ```

2. تثبيت الحزم:
   ```bash
   npm install --legacy-peer-deps
   ```

3. ضبط عنوان الاتصال بالـ API:
   - تم ضبط `mobile/config/urls.js` ليتعرف تلقائياً على المنصة:
     - عند التشغيل على **الويب**: يتصل بـ `http://localhost:8080/api`
     - عند التشغيل على **الجهاز الحقيقي**: يتصل بعنوان IP الخاص بجهازك على الشبكة المحلية (مثل `http://10.198.92.127:8080/api`)
     - عند التشغيل على **محاكي أندرويد**: يمكن استخدام `http://10.0.2.2:8080/api`

4. بدء تشغيل التطبيق:
   - **للتشغيل على متصفح الويب (Web):**
     ```bash
     npm run web
     ```
   - **للتشغيل عبر Expo (QR Code للأجهزة الذكية):**
     ```bash
     npm start
     ```
   - **لتشغيل محاكي Android:**
     ```bash
     npm run android
     ```

---

## 📤 خطوات الرفع إلى GitHub (Pushing to GitHub)

تمت تهيئة ملفات `.gitignore` لحماية المفاتيح السرية (`.env`) ومجلدات `node_modules` والملفات المؤقتة.

لرفع المشروع كاملاً إلى مستودع جديد على GitHub:

```bash
# 1. إضافة جميع الملفات النظيفة
git add .

# 2. حفظ التغييرات (Commit)
git commit -m "feat: complete project configuration and setup for mobile and server"

# 3. تغيير اسم الفرع الرئيسي إلى main
git branch -M main

# 4. ربط المستودع بمستودع GitHub الخاص بك (استبدل الرابط برابط مستودعك)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 5. رفع الكود
git push -u origin main
```
