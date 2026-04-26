'use client';

export default function FamilySection() {
  return (
    <section className="bg-white py-12 px-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Nhà Trai */}
        <div className="text-center font-sf">
          <p
            className="font-bold text-sm tracking-widest uppercase mb-3 text-gray-800"
          >
            Nhà Trai
          </p>
          <p className="text-gray-700 text-sm leading-relaxed font-normal">
            Ông Nguyễn Ngọc Bách
          </p>
          <p className="text-gray-700 text-sm leading-relaxed font-normal">
            Bà Nguyễn Thị Hương
          </p>
        </div>

        {/* Nhà Gái */}
        <div className="text-center font-sf">
          <p
            className="font-bold text-sm tracking-widest uppercase mb-3 text-gray-800"
          >
            Nhà Gái
          </p>
          <p className="text-gray-700 text-sm leading-relaxed font-normal">
            Ông Lý Chí Dùng
          </p>
          <p className="text-gray-700 text-sm leading-relaxed font-normal">
            Bà Vi Thị Hoàn
          </p>
        </div>
      </div>

      {/* Couple photos */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {/* Groom */}
        <div className="flex flex-col items-start">
          <div className="w-full aspect-[3/4] bg-gray-200 rounded overflow-hidden">
            <img
              src="/images/groom.jpg"
              alt="Chú rể"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <img
            src="/images/text_groom.png"
            alt="Chú rể"
            className="w-auto h-[20px] object-contain mt-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <p
            className="text-[#7B1C1C] font-uvn text-[28px]"
          >
            Ngọc Lâm
          </p>
        </div>

        {/* Bride */}
        <div className="flex flex-col items-end">
          <div className="w-full aspect-[3/4] bg-gray-200 rounded overflow-hidden">
            <img
              src="/images/bride.jpg"
              alt="Cô dâu"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <img
            src="/images/text_bride.png"
            alt="Chú rể"
            className="w-auto h-[20px] object-contain mt-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <p
            className="text-[#7B1C1C] font-uvn text-[28px]"
          >
            Ngọc Bích
          </p>
        </div>
      </div>
      <div>
      </div>
    </section>
  );
}
