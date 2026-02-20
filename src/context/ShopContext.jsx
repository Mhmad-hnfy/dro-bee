import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { translations } from "../translations";
import * as supabase from "../lib/supabase";

const ShopContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState(["Men", "Accessories", "Other"]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [settings, setSettings] = useState({ shippingCost: 10 });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetching from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes, promoRes, orderRes, userRes, shipRes] =
          await Promise.all([
            supabase.getAllProducts(),
            supabase.getAllCategories(),
            supabase.getAllPromoCodes(),
            supabase.getAllOrders(),
            supabase.getAllUsers(),
            supabase.getSetting("shipping_cost"),
          ]);

        if (prodRes.success)
          setProducts(
            prodRes.data.map((p) => ({
              ...p,
              discount: parseFloat(p.discount) || 0,
              views: p.views || 0,
            })),
          );
        if (catRes.success) setCategories(catRes.data);
        if (promoRes.success) setPromoCodes(promoRes.data);
        if (orderRes.success) {
          // Map snake_case and flattened Supabase data to expected legacy format
          const mappedOrders = orderRes.data.map((o) => ({
            ...o,
            date: o.created_at,
            user: {
              id: o.user_id,
              name: o.user_name,
              email: o.user_email,
            },
            details: {
              name: o.customer_name,
              email: o.customer_email,
              phone1: o.customer_phone,
              address: o.customer_address,
              city: o.customer_city,
              postalCode: o.customer_postal_code,
              notes: o.customer_notes,
              paymentMethod: o.payment_method || "cod", // Add default if missing
              shippingCost: o.shipping_cost,
            },
            items: (o.order_items || []).map((i) => ({
              ...i,
              name: i.product_name,
              image: i.product_image,
              qty: i.quantity,
            })),
          }));
          setOrders(mappedOrders);
        }
        if (userRes.success) setUsers(userRes.data);
        if (shipRes.success && shipRes.value)
          setSettings({ shippingCost: parseFloat(shipRes.value) });
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Persist local states to LocalStorage
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aHBqtWimpeBUJ8Lgg");
  }, []);

  // Action Helpers
  const registerUser = async (userData) => {
    const res = await supabase.registerUser(userData);
    if (res.success) {
      setUsers((prev) => [...prev, res.data]);
      setCurrentUser(res.data);
      setCart([]);
    }
    return res;
  };

  const loginUser = async (email, password) => {
    // Check locally for admin bypass if needed, but better to use Supabase
    const res = await supabase.loginUser(email, password);
    if (res.success) {
      setCurrentUser(res.data);
    }
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    toast.info("Session closed and cart cleared.");
  };

  const removeUser = async (id) => {
    const res = await supabase.supabase.from("users").delete().eq("id", id);
    if (!res.error) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User removed successfully");
    } else {
      toast.error("Failed to remove user");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    const { data, error } = await supabase.supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", userId)
      .select()
      .single();

    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(data);
      }
      toast.success("Role updated successfully");
    } else {
      toast.error("Failed to update role");
    }
  };

  const updateUserPermissions = async (userId, permissions) => {
    const { data, error } = await supabase.supabase
      .from("users")
      .update({ permissions })
      .eq("id", userId)
      .select()
      .single();

    if (!error) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? data : u)));
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(data);
      }
      toast.success("Permissions updated successfully");
    } else {
      toast.error("Failed to update permissions");
    }
  };

  const updateShippingCost = async (cost) => {
    const res = await supabase.updateSetting("shipping_cost", cost);
    if (res.success) {
      setSettings({ shippingCost: parseFloat(cost) });
      toast.success("Shipping cost updated");
    } else {
      toast.error("Failed to update shipping cost");
    }
  };

  const addProduct = async (product) => {
    const res = await supabase.addProduct(product);
    if (res.success) {
      setProducts((prev) => [res.data, ...prev]);
      toast.success("Product added successfully");
    } else {
      toast.error("Failed to add product");
    }
  };

  const editProduct = async (updatedProduct) => {
    const res = await supabase.updateProduct(updatedProduct.id, updatedProduct);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? res.data : p)),
      );
      setCart((prev) =>
        prev.map((item) =>
          item.id === updatedProduct.id ? { ...res.data, qty: item.qty } : item,
        ),
      );
      toast.success("Product updated successfully");
    } else {
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    const res = await supabase.deleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } else {
      toast.error("Failed to delete product");
    }
  };

  const addCategory = async (category) => {
    if (!categories.includes(category)) {
      const res = await supabase.addCategory(category);
      if (res.success) {
        setCategories((prev) => [...prev, category]);
      }
      return res; // Return result
    }
    return { success: false, message: "Category already exists" };
  };

  const deleteCategory = async (category) => {
    const res = await supabase.deleteCategory(category);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c !== category));
    }
    return res; // Return result
  };

  const editCategory = async (oldCategory, newCategory) => {
    // Supabase helper for editCategory is not in supabase.js, but we can update products
    // Actually categories are just names in categories table
    // For now we'll just add new and delete old if needed, or implement update
    toast.info("Edit category logic needs update in Supabase");
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const currentQty = existing ? existing.qty : 0;
      const availableStock =
        product.stock !== undefined ? parseInt(product.stock) : Infinity;

      if (currentQty + quantity > availableStock) {
        toast.error(`Cannot add more. Only ${availableStock} in stock.`);
        return prevCart;
      }

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item,
        );
      }
      return [...prevCart, { ...product, qty: quantity }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const availableStock =
            item.stock !== undefined ? parseInt(item.stock) : Infinity;
          if (newQuantity > availableStock) {
            toast.error(`Max stock available is ${availableStock}`);
            return { ...item, qty: availableStock };
          }
          if (newQuantity < 1) return item;
          return { ...item, qty: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const createOrder = async (orderDetails, promoInfo = null) => {
    const subtotal = cart.reduce(
      (sum, item) => sum + getDiscountedPrice(item) * item.qty,
      0,
    );
    const promoDiscount = promoInfo ? (subtotal * promoInfo.discount) / 100 : 0;
    const finalTotal =
      subtotal - promoDiscount + parseFloat(settings.shippingCost);

    const orderData = {
      userId: currentUser ? currentUser.id : null,
      userName: currentUser ? currentUser.name : "Guest",
      userEmail: currentUser ? currentUser.email : orderDetails.email,
      subtotal,
      shippingCost: settings.shippingCost,
      promoDiscount,
      total: finalTotal,
      promoCode: promoInfo ? promoInfo.code : null,
      customerName: orderDetails.name,
      customerEmail:
        orderDetails.email || (currentUser ? currentUser.email : ""),
      customerPhone: orderDetails.phone1,
      customerAddress: orderDetails.address,
      customerCity: orderDetails.city || "",
      customerPostalCode: orderDetails.postalCode || "",
      customerNotes: orderDetails.notes || "",
    };

    const res = await supabase.createOrder(orderData, cart);
    if (res.success) {
      const o = res.data;
      const newOrder = {
        ...o,
        date: o.created_at,
        user: {
          id: o.user_id,
          name: o.user_name,
          email: o.user_email,
        },
        details: {
          name: o.customer_name,
          email: o.customer_email,
          phone1: o.customer_phone,
          address: o.customer_address,
          city: o.customer_city,
          postalCode: o.customer_postal_code,
          notes: o.customer_notes,
          paymentMethod: o.payment_method || "cod",
          shippingCost: o.shipping_cost,
        },
        items: cart.map((i) => ({
          ...i,
          name: i.name || i.product_name,
          qty: i.qty || i.quantity,
        })),
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Update local products stock
      setProducts((prev) =>
        prev.map((p) => {
          const item = cart.find((i) => i.id === p.id);
          if (item) return { ...p, stock: Math.max(0, p.stock - item.qty) };
          return p;
        }),
      );

      clearCart();
      sendEmailNotification(newOrder);
      return newOrder;
    } else {
      toast.error("Failed to create order");
      return null;
    }
  };

  const sendEmailNotification = (order) => {
    const SERVICE_ID = "service_qp6iljl";
    const TEMPLATE_ID = "template_h8awf16";
    const PUBLIC_KEY = "aHBqtWimpeBUJ8Lgg";

    const templateParams = {
      admin_email: "hmwhnfy3@gmail.com",
      order_id: order.id,
      customer_name: order.customer_name || order.details?.name,
      email: "hmwhnfy3@gmail.com",
      orders: order.items.map((item) => ({
        name: item.name || item.product_name,
        units: item.qty || item.quantity,
        price: (item.price - (item.price * (item.discount || 0)) / 100).toFixed(
          2,
        ),
        image_url: item.image || item.product_image,
      })),
      cost: {
        shipping: parseFloat(settings.shippingCost).toFixed(2),
        tax: "0.00",
        total: order.total.toFixed(2),
      },
      view_link: `${window.location.origin}/admin/manage-orders`,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      () => toast.success("تم إرسال إشعار الأوردر للأدمن بنجاح"),
      (err) => console.error("EmailJS error:", err),
    );
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const res = await supabase.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success("Order status updated");
    }
  };

  const deleteOrder = async (orderId) => {
    // Missing deleteOrder in supabase.js, but we can assume it will be added or use standard delete
    const res = await supabase.supabase
      .from("orders")
      .delete()
      .eq("id", orderId);
    if (!res.error) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Order deleted");
    }
  };

  const trackProductView = async (productId) => {
    await supabase.incrementProductViews(productId);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p,
      ),
    );
  };

  const getDiscountedPrice = (product) => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^\d.]/g, ""))
        : parseFloat(product.price);
    const discount = parseFloat(product.discount) || 0;
    return discount > 0 ? price - (price * discount) / 100 : price;
  };

  const addPromoCode = async (code, discount) => {
    const res = await supabase.addPromoCode(code, discount);
    if (res.success) {
      setPromoCodes((prev) => [res.data, ...prev]);
      toast.success("Promo code added");
    }
  };

  const deletePromoCode = async (code) => {
    const res = await supabase.supabase
      .from("promo_codes")
      .delete()
      .eq("code", code);
    if (!res.error) {
      setPromoCodes((prev) => prev.filter((p) => p.code !== code));
      toast.success("Promo code deleted");
    }
  };

  const t = (key) => {
    const keys = key.split(".");
    let result = translations[language];
    for (const k of keys) {
      if (result && result[k]) result = result[k];
      else return key;
    }
    return result;
  };

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));

  return (
    <ShopContext.Provider
      value={{
        products,
        users,
        currentUser,
        cart,
        orders,
        settings,
        categories,
        promoCodes,
        isLoading,
        registerUser,
        loginUser,
        logout,
        addProduct,
        editProduct,
        deleteProduct,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        addCategory,
        deleteCategory,
        editCategory,
        trackProductView,
        getDiscountedPrice,
        addPromoCode,
        deletePromoCode,
        updateOrderStatus,
        deleteOrder,
        updateUserRole,
        updateUserPermissions,
        removeUser,
        updateShippingCost,
        language,
        t,
        toggleLanguage,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
