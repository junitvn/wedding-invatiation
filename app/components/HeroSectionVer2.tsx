'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, type Transition } from 'framer-motion';
import { imageUrl } from '../lib/image';
import EnvelopeSection from './EnvelopeSection';

const SONGS = [
    imageUrl('/music/50_nam_ve_sau.mp3'),
    imageUrl('/music/love_story.mp3'),
];

const VP = { once: true, amount: 0.1 };
const T: Transition = { duration: 0.8, ease: 'easeOut' };

export default function HeroSectionVer2() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [songIndex, setSongIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Attempt autoplay on mount
    useEffect(() => {
        audioRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    }, []);

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    const handleEnded = () => {
        const next = (songIndex + 1) % SONGS.length;
        setSongIndex(next);
    };

    // When song index changes, play next track
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isPlaying) return;
        audio.load();
        audio.play().catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songIndex]);

    return (
        <section className="relative w-full h-[70vh] min-h-[500px]">
            <audio
                ref={audioRef}
                src={SONGS[songIndex]}
                onEnded={handleEnded}
                preload="auto"
            />

            {/* Music button — top right */}
            <div
                className="absolute top-4 right-4 z-20 cursor-pointer select-none"
                onClick={toggleMusic}
                title={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
            >
                <div className="relative w-8 h-8">
                    {/* Disc — rotates when playing */}
                    <div className={`w-8 h-8 rounded-full border border-gold flex items-center justify-center${isPlaying ? ' animate-music-spin' : ''}`}>
                        <span className="text-gold text-[22px]">♪</span>
                    </div>
                    {/* Strikethrough — shown when paused */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[120%] h-[1px] bg-gold rotate-45 rounded-full" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center w-full flex-col pt-10">
                <motion.img
                    src={imageUrl('/images/hoa_cuoi_1.webp')}
                    alt=""
                    className="absolute left-0 top-[120px] w-24 rotate-30"
                    initial={{ opacity: 0, x: '-100%' }}
                    whileInView={{ opacity: 1, x: -40 }}
                    viewport={VP}
                    transition={T}
                />
                <motion.img
                    src={imageUrl('/images/hoa_cuoi_2.webp')}
                    alt=""
                    className="absolute right-0 top-[475px] w-20 -rotate-35"
                    initial={{ opacity: 0, x: '120%' }}
                    whileInView={{ opacity: 1, x: 29 }}
                    viewport={VP}
                    transition={T}
                />

                <motion.p
                    className="text-title text-[46px] font-normal font-katty tracking-widest"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={T}
                >
                    Wedding Invitation
                </motion.p>

                <motion.div
                    className="mt-10"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VP}
                    transition={T}
                >
                    <EnvelopeSection onOpen={() => {
                        if (!isPlaying) {
                            audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
                        }
                    }} />
                </motion.div>
            </div>
        </section>
    );
}
