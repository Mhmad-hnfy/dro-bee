import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useShop } from "../../context/ShopContext";

export default function Accessories() {
  const { t } = useShop();
  useEffect(() => {
    AOS.init({ duration: 1000 }); // مدة الأنيميشن
  }, []);
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
            <a href="#" className="group w-56">
              <img
                className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-top"
                src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=500&auto=format&fit=crop"
                alt="image"
              />
              <p className="text-sm mt-2">White crew-Neck T-Shirt</p>
              <p className="text-xl">EGP 29.00</p>
            </a>
            <a href="#" className="group w-56">
              <img
                className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right"
                src="https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600&auto=format&fit=crop"
                alt="image"
              />
              <p className="text-sm mt-2">White crew-Neck T-Shirt</p>
              <p className="text-xl">$ 39.00</p>
            </a>
            <a href="#" className="group w-56">
              <img
                className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right"
                src="https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=735&auto=format&fit=crop"
                alt="image"
              />
              <p className="text-sm mt-2">White crew-Neck T-Shirt</p>
              <p className="text-xl">EGP 29.00</p>
            </a>
            <a href="#" className="group w-56">
              <img
                className="rounded-lg w-full group-hover:shadow-xl hover:-translate-y-0.5 duration-300 transition-all h-72 object-cover object-right"
                src="https://images.unsplash.com/photo-1667243038099-b257ab263bfd?q=80&w=687&auto=format&fit=crop"
                alt="image"
              />
              <p className="text-sm mt-2">White crew-Neck T-Shirt</p>
              <p className="text-xl">$ 49.00</p>
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
