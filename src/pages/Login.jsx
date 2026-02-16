import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser, t } = useShop();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await loginUser(formData.email, formData.password);
    if (result.success) {
      navigate("/"); // Redirect to home on success
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("login.title")}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">{t("login.email")}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700">{t("login.password")}</label>
            <input
              type="password"
              name="password"
              required
              className="w-full border rounded px-3 py-2"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-600"
          >
            {t("login.submit")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("login.noAccount")}{" "}
          <Link to="/signup" className="text-yellow-600 font-semibold">
            {t("login.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
