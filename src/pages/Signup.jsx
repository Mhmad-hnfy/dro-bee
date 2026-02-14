import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function Signup() {
  const navigate = useNavigate();
  const { registerUser, t } = useShop();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("signup.matchError"));
      return;
    }

    const result = registerUser(formData);
    if (result.success) {
      toast.success(t("signup.success"));
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("signup.title")}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">{t("signup.name")}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">{t("signup.phone")}</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">{t("signup.email")}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">
              {t("signup.password")}
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">
              {t("signup.confirmPassword")}
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600"
          >
            {t("signup.submit")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("signup.haveAccount")}{" "}
          <Link to="/login" className="text-yellow-600 font-semibold">
            {t("signup.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
