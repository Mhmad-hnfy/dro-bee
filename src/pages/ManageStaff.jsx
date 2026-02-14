import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

const AVAILABLE_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard Access" },
  { id: "orders", label: "Manage Orders" },
  { id: "products", label: "Manage Products" },
  { id: "categories", label: "Manage Categories" },
  { id: "users", label: "Manage Users" },
  { id: "notifications", label: "Manage Notifications" },
];

export default function ManageStaff() {
  const { users, currentUser, updateUserRole, updateUserPermissions } =
    useShop();
  const [editingUser, setEditingUser] = useState(null);

  // Only the main admin can manage staff
  if (currentUser.email !== "hmwhnfy3@gmail.com") {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p>Only the super admin can manage staff roles and permissions.</p>
      </div>
    );
  }

  const handleToggleStaff = (user) => {
    const newRole = user.role === "staff" ? "user" : "staff";
    updateUserRole(user.id, newRole);
    toast.success(`${user.name} is now a ${newRole}`);
  };

  const handlePermissionToggle = (userId, currentPermissions, permissionId) => {
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter((id) => id !== permissionId)
      : [...currentPermissions, permissionId];
    updateUserPermissions(userId, newPermissions);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <p className="text-gray-500">
          Promote users to staff and define their access levels.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                User
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                Permissions
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.role === "staff"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.role === "staff" ? (
                    <div className="flex flex-wrap gap-1">
                      {(user.permissions || []).map((p) => (
                        <span
                          key={p}
                          className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100"
                        >
                          {p}
                        </span>
                      ))}
                      {(user.permissions || []).length === 0 && (
                        <span className="text-xs text-gray-400 italic">
                          No permissions
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleToggleStaff(user)}
                    className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                      user.role === "staff"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-yellow-600 hover:bg-yellow-50"
                    }`}
                  >
                    {user.role === "staff" ? "Revoke Staff" : "Make Staff"}
                  </button>
                  {user.role === "staff" && (
                    <button
                      onClick={() =>
                        setEditingUser(
                          editingUser?.id === user.id ? null : user,
                        )
                      }
                      className="text-xs font-bold text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
                    >
                      {editingUser?.id === user.id
                        ? "Close"
                        : "Set Permissions"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div
          className="mt-8 bg-white p-6 rounded-xl border border-yellow-200 shadow-lg"
          data-aos="fade-up"
        >
          <h3 className="text-lg font-bold mb-4">
            Set Permissions for{" "}
            <span className="text-yellow-600">{editingUser.name}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AVAILABLE_PERMISSIONS.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-yellow-500"
                  checked={(editingUser.permissions || []).includes(
                    permission.id,
                  )}
                  onChange={() => {
                    handlePermissionToggle(
                      editingUser.id,
                      editingUser.permissions || [],
                      permission.id,
                    );
                    // Refresh editingUser state from the latest users list
                    const updated = users.find((u) => u.id === editingUser.id);
                    setEditingUser({ ...updated });
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {permission.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
