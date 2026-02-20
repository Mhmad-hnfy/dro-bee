import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";

export default function Accessories() {
  const { addToCart, t } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 }); // مدة الأنيميشن
  }, []);

  const accessoriesData = [
    {
      id: "acc1",
      name: "White crew-Neck T-Shirt",
      price: 29.0,
      image:
        "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=500&auto=format&fit=crop",
      category: "Accessories",
    },
    {
      id: "acc2",
      name: "White crew-Neck T-Shirt",
      price: 39.0,
      image:
        "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600&auto=format&fit=crop",
      category: "Accessories",
    },
    {
      id: "acc3",
      name: "White crew-Neck T-Shirt",
      price: 29.0,
      image:
        "https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=735&auto=format&fit=crop",
      category: "Accessories",
    },
    {
      id: "acc4",
      name: "White crew-Neck T-Shirt",
      price: 49.0,
      image:
        "https://images.unsplash.com/photo-1667243038099-b257ab263bfd?q=80&w=687&auto=format&fit=crop",
      category: "Accessories",
    },
  ];

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

      <div data-aos="fade-up" data-aos-duration="3000">
        <div className="max-w-6xl mx-auto pt-8 pb-25">
          <p className="text-3xl font-medium text-slate-800 text-right mb-2 font-poppins pr-18 pb-8">
            {t("nav.accessories")}
          </p>
          <section className="flex flex-wrap items-center justify-center gap-6">
            {accessoriesData.map((item) => (
              <div key={item.id} className="group w-56 relative">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    className="w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-top"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 bg-white/95 backdrop-blur-sm p-3 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        addToCart(item);
                        toast.success(t("common.addedToCart"));
                      }}
                      className="w-full bg-yellow-500 text-black font-semibold py-1 text-xs rounded hover:bg-yellow-400 transition-colors"
                    >
                      {t("common.addToCart")}
                    </button>
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="w-full bg-black text-white font-semibold py-1 text-xs rounded hover:bg-gray-800 transition-colors"
                    >
                      {t("common.buyNow")}
                    </button>
                  </div>
                </div>
                <p className="text-sm mt-2">{item.name}</p>
                <p className="text-xl">EGP {item.price.toFixed(2)}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
