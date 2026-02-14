# خطوات تثبيت واستخدام Supabase

## 1. تثبيت مكتبة Supabase

```bash
npm install @supabase/supabase-js
```

## 2. إعداد ملف البيئة (اختياري)

أنشئ ملف `.env` في جذر المشروع:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. استخدام Supabase في المشروع

### الطريقة الأولى: استخدام الدوال المساعدة (موجودة في src/lib/supabase.js)

```javascript
import { getAllProducts, addProduct } from "./lib/supabase";

// الحصول على المنتجات
const { data: products } = await getAllProducts();

// إضافة منتج
await addProduct({
  name: "منتج جديد",
  price: 100,
  stock: 50,
  category: "Men",
});
```

### الطريقة الثانية: استخدام Supabase مباشرة

```javascript
import { supabase } from "./lib/supabase";

// قراءة البيانات
const { data, error } = await supabase.from("products").select("*");

// إضافة بيانات
const { data, error } = await supabase
  .from("products")
  .insert([{ name: "منتج", price: 100 }]);

// تحديث بيانات
const { data, error } = await supabase
  .from("products")
  .update({ price: 150 })
  .eq("id", 1);

// حذف بيانات
const { data, error } = await supabase.from("products").delete().eq("id", 1);
```

## 4. الملفات المهمة

- **supabase_setup.sql**: ملف SQL لإنشاء قاعدة البيانات
- **src/lib/supabase.js**: الدوال المساعدة للتعامل مع Supabase
- **supabase_guide.md**: دليل شامل بالعربية

## 5. الخطوات التالية

1. أنشئ مشروع على Supabase
2. نفذ ملف `supabase_setup.sql` في SQL Editor
3. احصل على Project URL و Anon Key
4. حدّث ملف `src/lib/supabase.js` بالمفاتيح الخاصة بك
5. ثبت المكتبة: `npm install @supabase/supabase-js`
6. ابدأ باستخدام الدوال المساعدة في مشروعك
