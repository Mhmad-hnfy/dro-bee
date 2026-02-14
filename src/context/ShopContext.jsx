import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { translations } from "../translations";

const ShopContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("products");
      const parsed = saved ? JSON.parse(saved) : [];
      // Ensure all products have a views field and numeric discount
      return (Array.isArray(parsed) ? parsed : []).map((p) => ({
        ...p,
        views: p.views || 0,
        discount: parseFloat(p.discount) || 0,
      }));
    } catch (e) {
      console.error("Failed to parse products", e);
      return [];
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("users");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse users", e);
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : { shippingCost: 10 };
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : ["Men", "Accessories", "Other"];
  });
  const [promoCodes, setPromoCodes] = useState(() => {
    const saved = localStorage.getItem("promoCodes");
    return saved ? JSON.parse(saved) : [];
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // Persist State to LocalStorage
  // Persist State to LocalStorage with Error Handling
  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
      if (
        error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED"
      ) {
        toast.error(
          "Storage full! Unable to save data. Please clear some space or delete old products/images.",
        );
      }
    }
  };

  useEffect(() => {
    saveToStorage("products", products);
  }, [products]);
  useEffect(() => {
    saveToStorage("users", users);
  }, [users]);
  useEffect(() => {
    saveToStorage("currentUser", currentUser);
  }, [currentUser]);
  useEffect(() => {
    saveToStorage("cart", cart);
  }, [cart]);
  useEffect(() => {
    saveToStorage("orders", orders);
  }, [orders]);
  useEffect(() => {
    saveToStorage("settings", settings);
  }, [settings]);
  useEffect(() => {
    saveToStorage("categories", categories);
  }, [categories]);
  useEffect(() => {
    saveToStorage("promoCodes", promoCodes);
  }, [promoCodes]);
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aHBqtWimpeBUJ8Lgg");
  }, []);

  // Actions
  const registerUser = (userData) => {
    let result = { success: true, message: "Account created successfully!" };

    setUsers((prev) => {
      if (prev.some((u) => u.email === userData.email)) {
        result = { success: false, message: "Email already registered" };
        return prev;
      }
      const newUser = {
        ...userData,
        id: Date.now(),
        role: "user",
        permissions: [],
      };

      // Force immediate login state update
      setCurrentUser(newUser);
      // Clear cart for new user
      setCart([]);

      return [...prev, newUser];
    });

    return result;
  };

  const loginUser = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      setCurrentUser(user);
      return {
        success: true,
        message: `Welcome ${user.role === "staff" ? "Staff" : ""} ${user.name}`,
      };
    }
    // Simple admin check
    if (email === "hmwhnfy3@gmail.com" && password === "29112003") {
      const adminUser = {
        id: 0,
        name: "Admin",
        email,
        role: "admin",
        permissions: [
          "dashboard",
          "orders",
          "notifications",
          "products",
          "categories",
          "users",
          "staff",
        ],
      };
      setCurrentUser(adminUser);
      return { success: true, message: "Welcome Admin" };
    }

    return { success: false, message: "Invalid credentials" };
  };

  const updateUserRole = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          const permissions =
            u.permissions || (newRole === "staff" ? ["dashboard"] : []);
          const updatedUser = { ...u, role: newRole, permissions };

          // Sync with currentUser if it's the same person
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updatedUser);
          }

          return updatedUser;
        }
        return u;
      }),
    );
  };

  const updateUserPermissions = (userId, permissions) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          const updatedUser = { ...u, permissions };

          // Sync with currentUser if it's the same person
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updatedUser);
          }

          return updatedUser;
        }
        return u;
      }),
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]); // Clear cart on logout to ensure clean session
    toast.info("Session closed and cart cleared.");
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      views: 0,
      discount: parseFloat(product.discount) || 0,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) =>
      prev.filter((p) => p.id.toString() !== id.toString()),
    );
  };

  const editProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id.toString() === updatedProduct.id.toString() ? updatedProduct : p,
      ),
    );
    setCart((prev) =>
      prev.map((item) =>
        item.id.toString() === updatedProduct.id.toString()
          ? { ...updatedProduct, qty: item.qty }
          : item,
      ),
    );
  };

  const removeUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
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
          // Check stock limit
          const availableStock =
            item.stock !== undefined ? parseInt(item.stock) : Infinity;
          if (newQuantity > availableStock) {
            toast.error(`Max stock available is ${availableStock}`);
            return { ...item, qty: availableStock };
          }
          if (newQuantity < 1) return item; // Don't reduce below 1 here, use remove for that
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

  const createOrder = (orderDetails, promoInfo = null) => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + getDiscountedPrice(item) * item.qty;
    }, 0);

    const promoDiscount = promoInfo ? (subtotal * promoInfo.discount) / 100 : 0;
    const finalTotal =
      subtotal - promoDiscount + parseFloat(settings.shippingCost);

    const newOrder = {
      id: Date.now(),
      user: currentUser
        ? {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
          }
        : "Guest",
      items: cart,
      details: orderDetails,
      promoCode: promoInfo ? promoInfo.code : null,
      promoDiscount: promoDiscount,
      total: finalTotal,
      shippingCost: settings.shippingCost,
      date: new Date().toISOString(),
      status: "Pending",
    };

    // Reduce stock for ordered items
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        if (cartItem && product.stock !== undefined) {
          const newStock = Math.max(0, parseInt(product.stock) - cartItem.qty);
          return { ...product, stock: newStock };
        }
        return product;
      }),
    );

    setOrders([...orders, newOrder]);
    clearCart();

    // Trigger Email Notification
    sendEmailNotification(newOrder);

    return newOrder;
  };

  const sendEmailNotification = (order) => {
    // These keys should normally be in .env, but for static site ease we set placeholders.
    // User needs to sign up at emailjs.com to get these.
    const SERVICE_ID = "service_qp6iljl"; // Updated from your screenshot
    const TEMPLATE_ID = "template_h8awf16"; // Replace with your Template ID
    const PUBLIC_KEY = "aHBqtWimpeBUJ8Lgg"; // Updated from your screenshot

    const templateParams = {
      admin_email: "hmwhnfy3@gmail.com",
      order_id: order.id,
      customer_name: order.details.name,
      email: "hmwhnfy3@gmail.com", // To match {{email}} in template
      orders: order.items.map((item) => ({
        name: item.name,
        units: item.qty,
        price: getDiscountedPrice(item).toFixed(2),
        image_url: item.image,
      })),
      cost: {
        shipping: parseFloat(settings.shippingCost).toFixed(2),
        tax: "0.00",
        total: order.total.toFixed(2),
      },
      view_link: `${window.location.origin}/admin/manage-orders`,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      (response) => {
        console.log("Email sent successfully!", response.status, response.text);
        toast.success("تم إرسال إشعار الأوردر للأدمن بنجاح");
      },
      (err) => {
        console.error("Failed to send email. Check EmailJS config.", err);
        toast.error("فشل إرسال إيميل للأدمن. تأكد من إعدادات EmailJS.");
      },
    );
  };

  const updateShippingCost = (cost) => {
    setSettings({ ...settings, shippingCost: cost });
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o,
      );

      // Trigger notification for Shipped or Delivered
      if (newStatus === "Shipped" || newStatus === "Delivered") {
        const order = updatedOrders.find((o) => o.id === orderId);
        if (order) {
          sendCustomerNotification(order, newStatus);
        }
      }

      return updatedOrders;
    });
  };

  const sendCustomerNotification = (order, status) => {
    const SERVICE_ID = "service_qp6iljl";
    const TEMPLATE_ID = "template_0v29dqs"; // Updated from your screenshot
    const PUBLIC_KEY = "aHBqtWimpeBUJ8Lgg";

    const templateParams = {
      customer_name: order.details.name,
      email: order.user.email || order.details.email || "customer@example.com",
      order_id: order.id,
      status: status === "Shipped" ? "شحن" : "توصيل",
      status_en: status,
      orders: order.items.map((item) => ({
        name: item.name,
        units: item.qty,
        price: getDiscountedPrice(item).toFixed(2),
        image_url: item.image,
      })),
      cost: {
        shipping: parseFloat(settings.shippingCost).toFixed(2),
        tax: "0.00",
        total: order.total.toFixed(2),
      },
      view_link: `${window.location.origin}/profile`,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      (response) => {
        console.log(`Customer ${status} email sent!`, response.status);
        toast.success(`تم إرسال تأكيد الـ ${status} للعميل بنجاح`);
      },
      (err) => {
        console.error(`Failed to send ${status} email to customer.`, err);
        toast.error(`فشل إرسال إيميل الـ ${status} للعميل`);
      },
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  // Category Actions
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const deleteCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const editCategory = (oldCategory, newCategory) => {
    setCategories(categories.map((c) => (c === oldCategory ? newCategory : c)));
    // Also update products with this category
    setProducts(
      products.map((p) =>
        p.category === oldCategory ? { ...p, category: newCategory } : p,
      ),
    );
  };

  const trackProductView = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id.toString() === productId.toString()
          ? { ...p, views: (p.views || 0) + 1 }
          : p,
      ),
    );
  };

  const getDiscountedPrice = (product) => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^\d.]/g, ""))
        : parseFloat(product.price);
    const discount = parseFloat(product.discount) || 0;
    if (discount > 0) {
      return price - (price * discount) / 100;
    }
    return price;
  };

  // Promo Code Actions
  const addPromoCode = (code, discountPercentage) => {
    setPromoCodes((prev) => [
      ...prev,
      { code: code.toUpperCase(), discount: parseFloat(discountPercentage) },
    ]);
  };

  const deletePromoCode = (code) => {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
  };

  // Translation Helper
  const t = (key) => {
    const keys = key.split(".");
    let result = translations[language];
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // Fallback to key if not found
      }
    }
    return result;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

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
        registerUser,
        loginUser,
        logout,
        addProduct,
        deleteProduct,
        editProduct,
        removeUser,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateShippingCost,
        updateOrderStatus,
        deleteOrder,
        addCategory,
        deleteCategory,
        editCategory,
        updateUserRole,
        updateUserPermissions,
        trackProductView,
        getDiscountedPrice,
        promoCodes,
        addPromoCode,
        deletePromoCode,
        language,
        t,
        toggleLanguage,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
