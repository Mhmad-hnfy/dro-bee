import React from "react";

const Loading = ({
  fullScreen = false,
  message = "Getting things ready...",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${fullScreen ? "fixed inset-0 bg-white/95 backdrop-blur-sm z-[9999]" : "py-12 w-full"}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        <div className="absolute w-20 h-20 border-4 border-yellow-100 rounded-full animate-ping opacity-20"></div>
        <div
          className="absolute w-28 h-28 border-4 border-yellow-50 rounded-full animate-ping opacity-10"
          style={{ animationDelay: "0.2s" }}
        ></div>

        {/* Main Spinner */}
        <div className="relative w-16 h-16">
          <svg
            className="w-full h-full animate-spin text-yellow-500"
            viewBox="0 0 50 50"
          >
            <circle
              className="opacity-25"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 25a21 21 0 0 1 21-21v2a19 19 0 0 0-19 19h-2z"
            />
          </svg>

          {/* Central Dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-lg shadow-yellow-500/50"></div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase font-poppins italic">
          Dro<span className="text-yellow-500">Bee</span>
        </h3>
        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-[0.2em] animate-pulse">
          {message}
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes custom-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Loading;
