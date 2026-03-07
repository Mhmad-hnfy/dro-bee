import React from "react";
import { useShop } from "../context/ShopContext";
import { Mail, Check, Trash2, MessageSquare, Phone } from "lucide-react";

export default function ManageMessages() {
  const { messages, markMessageAsRead, deleteContactMessage } = useShop();

  const handleToggleRead = async (message) => {
    if (!message.read) {
      await markMessageAsRead(message.id);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteContactMessage(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Messages
          </h2>
          <p className="text-gray-500 mt-1 font-medium">
            Manage customer inquiries and feedback
          </p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg font-bold border border-yellow-100 flex items-center gap-2">
          <MessageSquare size={18} />
          Total: {messages?.length || 0}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!messages || messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-inner">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 max-w-sm">
              When customers contact you through the form, their messages will
              appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`p-6 transition-all duration-300 hover:bg-gray-50/50 cursor-pointer group ${!msg.read ? "bg-blue-50/30" : ""}`}
                onClick={() => handleToggleRead(msg)}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4
                        className={`text-lg transition-colors ${!msg.read ? "font-black text-gray-900" : "font-bold text-gray-700"}`}
                      >
                        {msg.name}
                      </h4>
                      {!msg.read && (
                        <span className="bg-blue-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-md tracking-wider">
                          New
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                      {msg.phone && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Phone size={14} className="text-gray-400" />
                          <span dir="ltr">{msg.phone}</span>
                        </div>
                      )}
                      {msg.email && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500">
                          <Mail size={14} className="text-gray-400" />
                          {msg.email}
                        </div>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-xl border ${!msg.read ? "bg-white border-blue-100 shadow-sm" : "bg-gray-50 border-gray-100"} text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none`}
                    >
                      {msg.message}
                    </div>

                    <div className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {!msg.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(msg);
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip flex flex-col items-center"
                        title="Mark as Read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex flex-col items-center"
                      title="Delete Message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
