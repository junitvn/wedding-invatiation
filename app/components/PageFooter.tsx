'use client';

import { motion, type Transition } from 'framer-motion';
import { imageUrl } from '../lib/image';

const VP = { once: true, amount: 0.1 };
const T: Transition = { duration: 0.8, ease: 'easeOut' };

export default function PageFooter() {
  return (
    <footer className="bg-white text-center flex flex-col items-center justify-center pt-16 pb-10 gap-16">
      <motion.img
        src={imageUrl('/images/thanks.webp')}
        className="w-[80px]"
        alt=""
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={T}
      />
      <motion.p
        className="text-gold text-[40px] tracking-widest font-katty"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ ...T, delay: 0.1 }}
      >
        Thank you!
      </motion.p>
    </footer>
  );
}
