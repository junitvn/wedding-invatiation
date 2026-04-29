'use client';

import { motion, type Transition } from 'framer-motion';
import { imageUrl } from '../lib/image';

const VP = { once: true, amount: 0.1 };
const T: Transition = { duration: 0.8, ease: 'easeOut' };

export default function CoupleSection() {
  return (
    <section className="bg-white py-12 px-4">

      {/* Text */}
      <motion.p
        className="text-center text-title tracking-[0.1px] font-light text-[14px] font-sf leading-relaxed whitespace-pre-line"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      >
        {`
        Gửi đến bạn tấm thiệp cưới đầy yêu thương.
        Những ai nhận được lời mời này đều là những người 
        đặc biệt với bọn mình.
        Mong bạn và gia đình sẽ đến chung vui,
        Cùng chứng kiến khoảnh khắc hạnh phúc nhất của hai đứa.
        Cảm ơn vì luôn bên cạnh và yêu thương.
        Bọn mình rất mong được gặp bạn trong ngày vui này! ❤️
        `}
      </motion.p>

      {/* Fall in love wedding */}
      <div className="mt-12 -mx-8">
        {/* Header */}
        <div className="flex justify-between font-sf items-center text-black px-8 py-2">
          <motion.span
            className="font-normal tracking-[0.3em] text-[13px] uppercase"
            style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
            initial={{ opacity: 0, x: '-20%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >Fall In</motion.span>
          <motion.span
            className="font-normal tracking-[0.3em] text-[13px] uppercase"
            style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={T}
          >Love</motion.span>
          <motion.span
            className="font-normal tracking-[0.3em] text-[13px] uppercase"
            style={{ fontFamily: 'var(--gf-montserrat), sans-serif' }}
            initial={{ opacity: 0, x: '20%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >Wedding</motion.span>
        </div>
        <div className="h-7 bg-black" />
        {/* Photo with caption */}
        <div className="relative w-full">
          <img
            src={imageUrl('/images/ngang_1.webp')}
            alt="Fall in love wedding"
            className="w-full object-cover h-[225px] -mt-1"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black px-5 py-2">
            <motion.p
              className="text-white text-center text-[12px] font-light font-sf tracking-wide leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={T}
            >
              As the clouds and mist dissipate, I love you and everyone knows it
            </motion.p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-16 gap-10 mb-10">
        <img className="h-[24px]" src={imageUrl("/images/heart_gold.png")} alt="" />
        <span className="text-[40px] font-uvn text-gold">My Lover</span>
      </div>

      {/* Couple photos */}
      <div className="grid grid-cols-2 gap-4 mt-16">
        {/* Groom */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-full aspect-[3/4] bg-gray-200 rounded overflow-hidden"
            initial={{ opacity: 0, x: '-20%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >
            <img
              src={imageUrl('/images/groom.jpg')}
              alt="Chú rể"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: '-20%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >
            <div className="w-[1px] h-[32px] mt-[20px] bg-[#C0A062]" />
            <p className="text-[#C0A062] font-uvn text-[28px]">
              Ngọc Lâm
            </p>
          </motion.div>
        </div>

        {/* Bride */}
        <div className="flex flex-col items-center">
          <motion.div
            className="w-full aspect-[3/4] bg-gray-200 rounded overflow-hidden"
            initial={{ opacity: 0, x: '20%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >
            <img
              src={imageUrl('/images/bride.jpg')}
              alt="Cô dâu"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: '20%' }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={T}
          >
            <div className="w-[1px] h-[32px] mt-[20px] bg-[#C0A062]" />
            <p className="text-[#C0A062] font-uvn text-[28px]">
              Ngọc Bích
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
