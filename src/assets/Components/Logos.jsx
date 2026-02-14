const Logos = () => {
  const companyLogos = [
    "Matchingk",
    "Matching",
    "Matching",
    "Matching",
    "Matching",
    "Matching",
    "Matching",
  ];

  return (
    <>
      <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }

                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

      <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none bg-yellow-50/50 py-1 my-5 rounded-2xl">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div
          className="marquee-inner flex will-change-transform min-w-[200%]"
          style={{ animationDuration: "15s" }}
        >
          <div className="flex">
            {[...companyLogos, ...companyLogos].map((company, index) => (
              <img
                key={index}
                src="/10.png"
                alt={company}
                className="w-40 h-40 object-cover mx-6"
                draggable={false}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </>
  );
};
export default Logos;
