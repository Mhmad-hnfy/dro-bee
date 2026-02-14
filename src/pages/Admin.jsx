import React from "react";
import { Link } from "react-router-dom";
import AddPro from "./AddPro";
import Dashboard from "./Dashboard";
import ManageProducts from "./ManageProducts";
import ManageUsers from "./ManageUsers";
import ManageOrders from "./ManageOrders";
import ManageCategories from "./ManageCategories";
import ManageNotifications from "./ManageNotifications";
import ManageStaff from "./ManageStaff";
import Analytics from "./Analytics";
import ManagePromoCodes from "./ManagePromoCodes";
import { Route, Routes } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Admin() {
  const { currentUser, orders, users } = useShop();

  // Notification logic: Pending orders + Users from last 24h
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "Pending",
  ).length;
  const recentUsersCount = users.filter((u) => {
    const signupDate = new Date(u.id);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return signupDate > oneDayAgo;
  }).length;

  const totalNotifications = pendingOrdersCount + recentUsersCount;

  const hasPermission = (permission) => {
    if (currentUser.role === "admin") return true;
    return currentUser.permissions?.includes(permission);
  };

  return (
    <>
      {/* <div className='flex justify-center items -center min-h-[100vh] bg-amber-200 w-100' >
        <div>
        <h1 className='text-4xl font-bold text-gray-700'>Admin Page</h1>

        </div>
        <div className='flex justify-center  mt-5'>
          <Link to="/">الرئيسية</Link>
        </div>
       </div> */}
      <>
        {/* component */}
        <div className="flex flex-wrap bg-gray-100 w-full h-screen">
          <div className="w-3/12 bg-white rounded p-3 shadow-lg">
            <div className="flex items-center space-x-4 p-2 mb-5">
              <img
                className="h-20 rounded-full"
                src="/photo/ChatGPT Image Apr 19, 2025, 12_50_42 AM.png"
                alt="James Bhatta"
              />
              <div>
                <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">
                  {currentUser.name}
                </h4>
                <span className="text-sm tracking-wide flex items-center space-x-1">
                  <svg
                    className="h-4 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-gray-600">Verified</span>
                </span>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              {hasPermission("dashboard") && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                    >
                      <span className="text-gray-600">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/analytics"
                      className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                    >
                      <span className="text-gray-600">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                          />
                        </svg>
                      </span>
                      <span>Analytics</span>
                    </Link>
                  </li>
                </>
              )}
              {hasPermission("notifications") && (
                <li>
                  <Link
                    to="/admin/manage-notifications"
                    className="flex items-center justify-between text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </span>
                      <span>Notifications</span>
                    </div>
                    {totalNotifications > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {totalNotifications}
                      </span>
                    )}
                  </Link>
                </li>
              )}
              {hasPermission("users") && (
                <li>
                  <Link
                    to="/admin/manage-users"
                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                  >
                    <span className="text-gray-600">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </span>
                    <span>Users</span>
                  </Link>
                </li>
              )}
              {currentUser.role === "admin" && (
                <li>
                  <Link
                    to="/admin/manage-staff"
                    className="flex items-center space-x-3 text-yellow-700 p-2 rounded-md font-bold hover:bg-yellow-100 focus:bg-yellow-100"
                  >
                    <span className="text-yellow-600">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </span>
                    <span>Staff Management</span>
                  </Link>
                </li>
              )}
              {hasPermission("products") && (
                <>
                  <li>
                    <Link
                      to="/admin/add-product"
                      className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                    >
                      <span className="text-gray-600">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </span>
                      <span>Add a product</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/manage-products"
                      className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                    >
                      <span className="text-gray-600">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </span>
                      <span>Manage Products</span>
                    </Link>
                  </li>
                </>
              )}
              {hasPermission("categories") && (
                <li>
                  <Link
                    to="/admin/manage-categories"
                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                  >
                    <span className="text-gray-600">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </span>
                    <span>Manage Categories</span>
                  </Link>
                </li>
              )}
              {hasPermission("categories") && (
                <li>
                  <Link
                    to="/admin/manage-promo-codes"
                    className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                  >
                    <span className="text-gray-600">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                    </span>
                    <span>Promo Codes</span>
                  </Link>
                </li>
              )}
              {hasPermission("orders") && (
                <li>
                  <Link
                    to="/admin/manage-orders"
                    className="flex items-center justify-between text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">
                        <svg
                          className="h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </span>
                      <span>Manage Orders</span>
                    </div>
                    {pendingOrdersCount > 0 && (
                      <span className="bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
                >
                  <span className="text-gray-600">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-9/12">
            <div className="p-4 text-gray-500">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manage-orders" element={<ManageOrders />} />
                <Route
                  path="/manage-notifications"
                  element={<ManageNotifications />}
                />
                <Route path="/add-product" element={<AddPro />} />
                <Route path="/manage-products" element={<ManageProducts />} />
                <Route
                  path="/manage-categories"
                  element={<ManageCategories />}
                />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-staff" element={<ManageStaff />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route
                  path="/manage-promo-codes"
                  element={<ManagePromoCodes />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default Admin;
