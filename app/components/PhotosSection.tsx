'use client';

import { imageUrl } from '../lib/image';

export default function PhotosSection() {
    return (
        <section className="bg-white pt-12 pb-16 flex justify-center items-center flex-col overflow-hidden">
            {/* Top quote */}
            <p className="px-10 text-title text-[14px] font-light font-sf leading-loose mb-16 whitespace-pre-line">
                {`Có lẽ thế gian này có vô vàn điều tươi đẹp,\nNhưng trong lòng em, đẹp nhất vẫn chỉ có anh`}
            </p>

            {/* Collage — pb creates space for the overflowing sticker and text */}
            <div className="relative pb-[20%] w-full flex">
                {/* Left vertical labels */}
                <div className="absolute left-[68px] top-14 z-10 flex flex-col gap-[48px]">
                    <span
                        className="text-gold text-[10px] tracking-[0.3em] uppercase animate-down mt-4"
                        style={{
                            fontFamily: 'var(--gf-montserrat), sans-serif',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                        }}
                    >
                        My Love
                    </span>
                    <span
                        className="text-gold text-[10px] mt-10 tracking-[0.3em] uppercase animate-down"
                        style={{
                            fontFamily: 'var(--gf-montserrat), sans-serif',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                        }}
                    >
                        Forever
                    </span>
                </div>

                {/* Main photo */}
                <div className="flex flex-col justify-end items-end pr-10">
                    <img
                        src={imageUrl('/images/hero.webp')}
                        alt="Wedding photo"
                        className="w-3/4 object-cover animate-up"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                {/* Cutout sticker — overlaps bottom-left of main photo, anchored at container bottom */}
                <div className="absolute bottom-0 left-10 w-[45%] z-20">
                    <img
                        src={imageUrl('/images/photo_2.webp')}
                        className="w-full h-auto animate-left"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                {/* I LOVE YOU */}
                <p
                    className="absolute bottom-[0%] right-10 uppercase text-gold font-katty text-[28px] leading-none text-right animate-right"
                >
                    Love You
                </p>
            </div>
        </section>
    );
}
