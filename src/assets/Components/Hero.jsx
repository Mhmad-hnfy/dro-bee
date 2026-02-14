import Logos from "./Logos";
import Imgs from "./Imgs";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

export default function Hero() {
  const { t } = useShop();

  return (
    <div className="flex flex-col gap-12">
      <section className="relative min-h-[500px] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white">
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl opacity-50"></div>

        <div
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6"
          data-aos="zoom-in"
        >
          <span className="px-4 py-1.5 bg-yellow-400 text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full">
            {t("nav.newArrival")}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-black leading-tight">
            {t("hero.title1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl font-medium">
            {t("hero.subtitle")}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Link
              to="/products"
              className="px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-xl shadow-black/10"
            >
              {t("nav.shopNow")}
            </Link>
            <Link
              to="/search"
              className="px-10 py-4 border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all duration-300"
            >
              {t("nav.exploreMore")}
            </Link>
          </div>
        </div>
      </section>

      <Imgs />
      <Logos />
    </div>
  );
}
