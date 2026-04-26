'use client';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      {/* Fallback gradient when no image */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-500" /> */}

      {/* Save the date - top left */}
      <div className="absolute top-5 left-5 z-20 font-sans">
        <p className="text-white text-xs font-bold font-ljr tracking-widest uppercase opacity-90">
          Save the date
        </p>
        <p className="text-white text-xs font-bold font-ljr tracking-wider opacity-90 mt-0.5">
          16.05.2026
        </p>
      </div>

      {/* Music note top right */}
      <div className="absolute top-4 right-4 z-20">
        <div className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center">
          <span className="text-white text-sm">♪</span>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-white via-white/70 to-transparent z-10" />

      {/* White arch — flat 20% | curve up 100px | flat 20% */}
      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ height: '300px' }}>
        {/*
          viewBox 430×300: flat level at y=200, control point at y=0
          → bezier peak = (0.25×200 + 0.5×0 + 0.25×200) = 100px above flat
        */}
        <svg
          className="absolute inset-0 w-full"
          style={{ height: '300px' }}
          viewBox="0 0 430 300"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0 200 L 86 200 C 150 100 280 100 344 200 L 430 200 L 430 300 L 0 300 Z" fill="white" />
        </svg>

        {/* Bow at arch peak (100px from top of container) */}
        <div className="absolute left-1/2 z-30" style={{ top: '138px', transform: 'translateX(-50%) translateY(-50%)' }}>
          <img
            src="/images/no_do.png"
            alt=""
            className="w-20 object-contain select-none"
            style={{ transformOrigin: 'top center', animation: 'bowSway 3s ease-in-out infinite' }}
          />
        </div>

        {/* Text */}
        <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center">
          <h1 className="text-[#7B1C1C] text-[25px] font-bold tracking-[0.3em] uppercase font-ljr">
            WEDDING
          </h1>
          <p className="text-[#7B1C1C] mt-4 text-[32px] font-medium whitespace-nowrap font-uvn">
            Ngọc Lâm &nbsp;-&nbsp; Ngọc Bích
          </p>
        </div>
      </div>
    </section>
  );
}
