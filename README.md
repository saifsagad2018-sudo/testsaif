# 🌹 Luxury Perfume Store — متجر عطور فاخر

متجر إلكتروني متكامل مع لوحة تحكم إدارية شاملة، مبني بـ Next.js 14 + TypeScript + Tailwind CSS.

---

## 🏗️ هيكل المشروع

```
src/
├── app/
│   ├── page.tsx                    # الصفحة الرئيسية للمتجر
│   ├── layout.tsx                  # Layout عام + حقن الثيم
│   ├── globals.css                 # CSS المشتركة
│   ├── products/[id]/
│   │   ├── page.tsx                # صفحة المنتج التفصيلية
│   │   └── ProductDetailClient.tsx # المكونات التفاعلية
│   ├── admin/
│   │   ├── page.tsx                # Dashboard (محمي)
│   │   ├── AdminDashboardClient.tsx# لوحة التحكم الكاملة
│   │   └── login/page.tsx          # صفحة تسجيل الدخول
│   └── api/
│       ├── admin/login/route.ts    # مسار تسجيل الدخول
│       ├── admin/logout/route.ts   # مسار تسجيل الخروج
│       └── gist/
│           ├── save/route.ts       # حفظ البيانات في Gist
│           └── data/route.ts       # قراءة البيانات
├── components/store/
│   ├── Header.tsx                  # الهيدر الديناميكي
│   ├── Hero.tsx                    # القسم الرئيسي
│   ├── FeaturedProducts.tsx        # عرض المنتجات مع فلاتر
│   ├── CategoryFilter.tsx          # فلتر التصنيفات
│   ├── CartDrawer.tsx              # درج السلة
│   └── Footer.tsx                  # الفوتر
├── lib/
│   ├── gist.ts                     # قراءة/كتابة GitHub Gist
│   ├── cloudinary.ts               # رفع الصور
│   ├── auth.ts                     # التحقق من الجلسة
│   ├── theme.ts                    # توليد CSS الثيم
│   ├── cart.tsx                    # Hook سلة التسوق
│   └── defaults.ts                 # البيانات الافتراضية
├── types/index.ts                  # أنواع TypeScript
└── middleware.ts                   # حماية مسارات /admin
```

---

## ⚡ الإعداد السريع

### 1. استنساخ المشروع وتثبيت الحزم

```bash
git clone <repo-url>
cd luxury-perfume-store
npm install
```

### 2. إعداد متغيرات البيئة

```bash
cp .env.example .env.local
```

افتح `.env.local` وأضف قيمك الحقيقية:

```env
ADMIN_PASS=كلمة_المرور_السرية_القوية
GIST_ID=معرف_الـ_gist
GITHUB_TOKEN=ghp_توكن_github
NEXT_PUBLIC_CLOUDINARY_CLOUD=اسم_الحساب
NEXT_PUBLIC_CLOUDINARY_PRESET=اسم_الـ_preset
```

### 3. إنشاء GitHub Gist (قاعدة البيانات)

أبسط طريقة — اذهب إلى https://gist.github.com وأنشئ Gist خاصاً (`Secret`) باسم الملف `store-data.json` بمحتوى `{}`.

**أو** عبر الكود بتشغيل هذا مرة واحدة فقط:

```bash
npx ts-node -e "
const { initGist } = require('./src/lib/gist');
initGist().then(id => console.log('GIST_ID:', id));
"
```

### 4. تشغيل التطوير المحلي

```bash
npm run dev
# المتجر: http://localhost:3000
# Admin:  http://localhost:3000/admin
```

---

## 🚀 النشر على Cloudflare Pages

### الطريقة الأولى: عبر Next.js المعتادة (الأسهل)

```bash
npm run build
# ارفع المشروع على Vercel أو Cloudflare Pages
```

### الطريقة الثانية: Cloudflare Pages Native (Edge)

```bash
# ثبّت أداة Cloudflare
npm install -D @cloudflare/next-on-pages

# عدّل أمر البناء في wrangler.toml:
# command = "npx @cloudflare/next-on-pages"

# انشر
npx wrangler pages deploy .vercel/output/static
```

### إعداد المتغيرات على Cloudflare

```bash
# عبر CLI
wrangler secret put ADMIN_PASS
wrangler secret put GIST_ID
wrangler secret put GITHUB_TOKEN

# أو عبر Dashboard:
# Pages > اسم مشروعك > Settings > Environment Variables
```

**المتغيرات العامة** (تبدأ بـ `NEXT_PUBLIC_`) تُضاف في:
`Pages > Settings > Environment Variables > Production`

---

## 🎨 نظام الثيمات

| الثيم | الوصف | الألوان |
|-------|-------|---------|
| Dark Luxury | أسود ذهبي فاخر | `#0A0805` + `#C9A84C` |
| Light Minimalist | أبيض نظيف | `#FAFAF8` + `#2C2420` |
| Warm Pastel | باستيل دافئ | `#FBF6F0` + `#B07A5C` |

يمكن إضافة ثيمات جديدة من لوحة التحكم أو تعديل أي ثيم يدوياً.

---

## 🔐 الأمان

- ✅ **لا secrets في الكود** — جميعها في متغيرات البيئة
- ✅ **كلمة المرور تُقارن في السيرفر فقط** — لا تُرسل للعميل
- ✅ **cookie `httpOnly`** — محمية من XSS
- ✅ **Middleware** يحمي جميع مسارات `/admin/*`
- ✅ **API routes** تتحقق من الجلسة قبل أي تعديل
- ✅ **Cloudinary Unsigned Preset** — لا token في المتصفح

---

## 📋 ميزات لوحة التحكم

### إعدادات الموقع
- تغيير اسم الموقع، عنوان الهيرو، الوصف
- رفع اللوجو والفافيكون وصورة الخلفية عبر Cloudinary
- تغيير العملة

### نظام الثيمات
- 3 ثيمات جاهزة
- تفعيل ثيم بضغطة زر واحدة
- تخصيص الألوان يدوياً عبر color picker

### إدارة المنتجات
- إضافة / تعديل / حذف المنتجات
- رفع صور متعددة لكل منتج
- أحجام متعددة مع أسعار ومخزون مستقل
- تحديد حالة كل حجم (متاح / محدود / نفذ)
- مكونات العطر (Top / Heart / Base Notes)
- تحديد المنتجات المميزة

### التصنيفات
- إضافة / تعديل / حذف تصنيفات العطور
- دعم الاسم العربي والإنجليزي مع أيقونة

---

## 🛒 ميزات المتجر

- فلاتر المنتجات حسب التصنيف والسعر
- صفحة تفصيلية لكل منتج مع معرض صور
- محدد الأحجام يحدّث السعر فورياً
- سلة تسوق محفوظة في localStorage
- درج السلة الجانبي بتصميم سلس
- متجاوب مع جميع أحجام الشاشات (Responsive)
- دعم RTL بالكامل للعربية

---

## 🔧 تخصيص إضافي

### إضافة عملة جديدة
في لوحة التحكم > الإعدادات > العملة — أدخل `ر.س` أو `€` أو أي رمز.

### إضافة ثيم جديد برمجياً
في `src/lib/defaults.ts`، أضف ثيماً جديداً لمصفوفة `BUILT_IN_THEMES`.

### نظام الدفع
للتكامل مع Stripe أو PayPal، عدّل زر "إتمام الطلب" في `CartDrawer.tsx` ليوجه للـ checkout page.
