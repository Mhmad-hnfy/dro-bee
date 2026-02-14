import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

const Nav = () => {
  const [open, setOpen] = React.useState(false);
  const { cart, currentUser, logout, t, language, toggleLanguage } = useShop();

  return (
    <>
      <div className="w-full py-2 font-medium text-black text-center bg-yellow-400">
        <p>{t("nav.specialDeal")}</p>
      </div>
      <nav className=" top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-25 py-1 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all shadow-sm">
        <Link to="/">
          <img width="130" height="130" src="/10.png" alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          <Link to="/" className="hover:text-yellow-600 transition-colors">
            {t("nav.home")}
          </Link>
          <a
            href="/#categories"
            className="hover:text-yellow-600 transition-colors"
          >
            {t("nav.categories")}
          </a>
          <Link
            to="/products"
            className="hover:text-yellow-600 transition-colors"
          >
            {t("nav.products")}
          </Link>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder={t("nav.search")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  window.location.href = `/search?q=${e.target.value}`;
                }
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.836 10.615 15 14.695"
                stroke="#7A7B7D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                clipRule="evenodd"
                d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                stroke="#7A7B7D"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <Link to="/cart" className="relative cursor-pointer">
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#EAB308"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 text-xs text-black bg-yellow-400 font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white">
                {cart.length}
              </span>
            )}
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link
                to={
                  currentUser.role === "user" ? "/profile" : "/admin/dashboard"
                }
                className="text-sm font-semibold text-gray-700 hover:text-yellow-600"
              >
                {t("nav.hi")}, {currentUser.name}
              </Link>
              {(currentUser.role === "admin" ||
                currentUser.role === "staff") && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm text-yellow-600 font-bold"
                >
                  {t("nav.admin")}
                </Link>
              )}
              <button
                onClick={logout}
                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full text-xs"
              >
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="cursor-pointer px-8 py-2 bg-yellow-500 hover:bg-yellow-600 transition text-black font-semibold rounded-full"
            >
              {t("nav.login")}
            </Link>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 border-2 border-gray-100 rounded-full hover:border-yellow-400 transition-all text-xs font-bold"
          >
            <span
              className={
                language === "en" ? "text-yellow-600" : "text-gray-400"
              }
            >
              EN
            </span>
            <span className="text-gray-300">|</span>
            <span
              className={
                language === "ar" ? "text-yellow-600" : "text-gray-400"
              }
            >
              AR
            </span>
          </button>
        </div>

        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="sm:hidden"
        >
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="black" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="black" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="black" />
          </svg>
        </button>

        {/* Mobile Menu */}
        <div
          className={`${open ? "flex" : "hidden"} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
        >
          <Link
            to="/"
            className="block py-2 hover:text-yellow-600"
            onClick={() => setOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <a
            href="/#categories"
            className="block py-2 hover:text-yellow-600"
            onClick={() => setOpen(false)}
          >
            {t("nav.categories")}
          </a>
          <Link
            to="/products"
            className="block py-2 hover:text-yellow-600"
            onClick={() => setOpen(false)}
          >
            {t("nav.products")}
          </Link>
          <Link
            to="/cart"
            className="block py-2 hover:text-yellow-600"
            onClick={() => setOpen(false)}
          >
            {t("nav.cart")} ({cart.length})
          </Link>
          {currentUser ? (
            <>
              <p className="block py-2 font-bold">
                {t("nav.hi")}, {currentUser.name}
              </p>
              {(currentUser.role === "admin" ||
                currentUser.role === "staff") && (
                <Link
                  to="/admin/dashboard"
                  className="block py-2 text-yellow-600 font-bold"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.admin")}
                </Link>
              )}
              <button
                onClick={logout}
                className="block py-2 text-red-500 w-full text-left"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="cursor-pointer px-6 py-2 mt-2 bg-yellow-500 hover:bg-yellow-600 transition text-black font-semibold rounded-full text-sm inline-block"
            >
              {t("nav.login")}
            </Link>
          )}

          <button
            onClick={() => {
              toggleLanguage();
              setOpen(false);
            }}
            className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-xs"
          >
            🌐 {language === "en" ? "العربية" : "English"}
          </button>
        </div>
      </nav>
    </>
  );
};
export default Nav;
