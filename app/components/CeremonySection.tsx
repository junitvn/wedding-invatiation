'use client';

import { VENUES } from '../config';
import { imageUrl } from '../lib/image';

export default function CeremonySection() {

  const FILM_IMAGES = [
    imageUrl('/images/film_1.webp'),
    imageUrl('/images/film_3.webp'),
    imageUrl('/images/film_2.webp'),
  ]

  const TEXT_IN_IMAGES = [
    "I love three things in this world.",
    "Sun, Moon, and you.",
    "Sun for morning, Moon for night, and you forever."
  ]

  return (
    <section className="bg-white flex flex-col items-center -mx-2">
      <div className="text-center mb-6">
        <p
          className="text-title text-[16px] font-light font-sf whitespace-pre-line"
        >
          {
            `
            Trái tim anh,
            Tựa cánh chim nhỏ giữa đồng hoang,
            Đã tìm thấy bầu trời của riêng mình
            Trong đôi mắt em.
            `
          }
        </p>
      </div>


      <div className="flex w-full mt-10">
        <div className="flex w-full justify-between font-sf items-center text-black px-8">
          <span className="font-normal tracking-[0.3em] text-[13px] uppercase animation-left" style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}>WELCOME</span>
          <span className="font-normal tracking-[0.3em] text-[13px] uppercase animation-up" style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}>TO OUR</span>
          <span className="font-normal tracking-[0.3em] text-[13px] uppercase animation-right" style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}>WEDDING</span>
        </div>
      </div>
      <div className="flex justify-center items-center bg-black mt-4 relative">
        <img
          src={imageUrl("/images/film_container.webp")}
          className="w-full"
          alt="" />
        <div className='absolute top-[19px] px-[40px] z-2 gap-2'>
          {FILM_IMAGES.map((img, idx) => {
            return (
              <div key={`container-${idx}`} className='relative'>
                <img
                  key={`image-${idx}`}
                  src={img}
                  className="w-full mt-1 h-[232px]"
                  alt="" />
                <p
                  className='absolute bg-black text-white bottom-0 animate-up left-0 right-0 text-center text-[14px] font-light font-sf tracking-wide leading-relaxed font-sf'>
                  {TEXT_IN_IMAGES[idx]}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-black h-20 -mt-1 w-full">

      </div>


      {/* Decorative line */}
      <div className="h-px bg-gray-200 mb-8" />

      {/* Vietnamese calendar date display */}
      <div className="text-center mb-4 w-full">
        <p
          className="tracking-[0.25em] text-title text-[24px] font-sf mb-4"
        >
          LỄ THÀNH HÔN
        </p>
        <div className="flex justify-center font-sf grid grid-cols-3 w-full uppercase">
          <div className="flex flex-col items-center justify-center w-full h-full mt-2">
            <p className="border border-[1px] border-l-0 border-r-0 border-gray-600 text-gold w-full text-[24px]">Tháng 5</p>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-[24px] font-light text-gold">CHỦ NHẬT</p>
            <p className="font-bold text-[60px] text-gold">17</p>
            <p className="text-[24px] font-normal text-gold">14:30</p>
          </div>
          <div className="flex flex-col items-center justify-center w-full h-full mt-2">
            <p className="border border-l-0 border-r-0 border-gray-600 text-gold text-[24px] w-full">Năm 2026</p>
          </div>
        </div>
      </div>

      {/* Lunar date */}
      <div className="text-center mt-4">
        <p className="text-title font-sf text-sm">
          Tức ngày: 01 tháng 04 năm Bính Ngọ
        </p>
      </div>

      <p className="mt-10 text-title text-[16px] font-normal font-sf uppercase">
        Hôn lễ được cử hành tại
      </p>
      <p className="my-4 text-gold text-[24px] font-normal font-sf uppercase">
        {VENUES.nhatrai.title}
      </p>
      <p className="text-title text-[16px] font-normal text-center whitespace-pre-line font-sf">
        {VENUES.nhatrai.textAddress}
      </p>

      {/* Decorative line */}
      <div className="h-px bg-gray-200 mt-8" />
    </section>
  );
}
