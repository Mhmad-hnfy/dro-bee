// src/lib/supabase.js
// Supabase Client Configuration

import { createClient } from "@supabase/supabase-js";

// ⚠️ استبدل هذه القيم في ملف .env
// Settings > API
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_PROJECT_URL";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

// إنشاء عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================
// دوال مساعدة للعمليات الشائعة
// =====================================================

// ==================== المستخدمين ====================

/**
 * تسجيل مستخدم جديد
 */
export const registerUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: userData.password, // ⚠️ في الإنتاج، استخدم Supabase Auth بدلاً من تخزين كلمة المرور
          phone: userData.phone,
          role: "user",
          permissions: [],
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, message: "Account created successfully!" };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: error.message };
  }
};

/**
 * تسجيل دخول المستخدم
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) throw error;
    if (!data) {
      return { success: false, message: "Invalid credentials" };
    }

    return {
      success: true,
      data,
      message: `Welcome ${data.role === "staff" ? "Staff" : ""} ${data.name}`,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Invalid credentials" };
  }
};

/**
 * الحصول على جميع المستخدمين (للأدمن فقط)
 */
export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, data: [] };
  }
};

// ==================== المنتجات ====================

/**
 * الحصول على جميع المنتجات
 */
export const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [] };
  }
};

/**
 * إضافة منتج جديد
 */
export const addProduct = async (product) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          discount: parseFloat(product.discount) || 0,
          stock: parseInt(product.stock) || 0,
          category: product.category,
          image: product.image,
          views: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, message: error.message };
  }
};

/**
 * تحديث منتج
 */
export const updateProduct = async (productId, updates) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: error.message };
  }
};

/**
 * حذف منتج
 */
export const deleteProduct = async (productId) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: error.message };
  }
};

/**
 * زيادة عدد مشاهدات المنتج
 */
export const incrementProductViews = async (productId) => {
  try {
    const { error } = await supabase.rpc("increment_product_views", {
      product_id: productId,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error incrementing views:", error);
    return { success: false };
  }
};

// ==================== الفئات ====================

/**
 * الحصول على جميع الفئات
 */
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return { success: true, data: data.map((c) => c.name) };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [] };
  }
};

/**
 * إضافة فئة جديدة
 */
export const addCategory = async (categoryName) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: categoryName }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false, message: error.message };
  }
};

/**
 * حذف فئة
 */
export const deleteCategory = async (categoryName) => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("name", categoryName);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: error.message };
  }
};

// ==================== الطلبات ====================

/**
 * إنشاء طلب جديد
 */
export const createOrder = async (orderData, items) => {
  try {
    // إنشاء الطلب
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: orderData.userId,
          user_name: orderData.userName,
          user_email: orderData.userEmail,
          status: "Pending",
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shippingCost,
          promo_discount: orderData.promoDiscount || 0,
          total: orderData.total,
          promo_code: orderData.promoCode,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          customer_address: orderData.customerAddress,
          customer_city: orderData.customerCity,
          customer_postal_code: orderData.customerPostalCode,
          customer_notes: orderData.customerNotes,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // إضافة عناصر الطلب
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      price: item.price,
      discount: item.discount || 0,
      quantity: item.qty,
      subtotal: item.price * item.qty,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // تحديث المخزون
    for (const item of items) {
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        product_id: item.id,
        quantity: item.qty,
      });
      if (stockError) console.error("Error updating stock:", stockError);
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: error.message };
  }
};

/**
 * الحصول على طلبات المستخدم
 */
export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, data: [] };
  }
};

/**
 * الحصول على جميع الطلبات (للأدمن)
 */
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, data: [] };
  }
};

/**
 * تحديث حالة الطلب
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: error.message };
  }
};

// ==================== أكواد الخصم ====================

/**
 * التحقق من صلاحية كود الخصم
 */
export const validatePromoCode = async (code) => {
  try {
    const { data, error } = await supabase.rpc("validate_promo_code", {
      code_input: code,
    });

    if (error) throw error;
    return {
      success: data[0].is_valid,
      discount: data[0].discount,
      message: data[0].message,
    };
  } catch (error) {
    console.error("Error validating promo code:", error);
    return { success: false, message: "Invalid promo code" };
  }
};

/**
 * الحصول على جميع أكواد الخصم
 */
export const getAllPromoCodes = async () => {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return { success: false, data: [] };
  }
};

/**
 * إضافة كود خصم جديد
 */
export const addPromoCode = async (
  code,
  discount,
  maxUsage = null,
  expiresAt = null,
) => {
  try {
    const { data, error } = await supabase
      .from("promo_codes")
      .insert([
        {
          code: code.toUpperCase(),
          discount: parseFloat(discount),
          is_active: true,
          max_usage: maxUsage,
          expires_at: expiresAt,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error adding promo code:", error);
    return { success: false, message: error.message };
  }
};

// ==================== الإعدادات ====================

/**
 * الحصول على قيمة إعداد معين
 */
export const getSetting = async (key) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) throw error;
    return { success: true, value: data.value };
  } catch (error) {
    console.error("Error fetching setting:", error);
    return { success: false, value: null };
  }
};

/**
 * تحديث قيمة إعداد
 */
export const updateSetting = async (key, value) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update({ value: value.toString() })
      .eq("key", key)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating setting:", error);
    return { success: false, message: error.message };
  }
};

// ==================== عربة التسوق ====================

/**
 * الحصول على عربة التسوق للمستخدم
 */
export const getUserCart = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (*)
      `,
      )
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { success: false, data: [] };
  }
};

/**
 * إضافة منتج لعربة التسوق
 */
export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // التحقق من وجود المنتج في العربة
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      // تحديث الكمية
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } else {
      // إضافة منتج جديد
      const { data, error } = await supabase
        .from("cart_items")
        .insert([
          {
            user_id: userId,
            product_id: productId,
            quantity,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: error.message };
  }
};

/**
 * حذف منتج من العربة
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, message: error.message };
  }
};

/**
 * مسح العربة بالكامل
 */
export const clearCart = async (userId) => {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, message: error.message };
  }
};
