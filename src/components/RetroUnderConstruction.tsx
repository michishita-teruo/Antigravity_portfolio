import React from 'react';
import { motion } from 'framer-motion';
import { HardHat, Construction, Shovel } from 'lucide-react';

export const RetroUnderConstruction: React.FC = () => {
    return (
        <div className="bg-[#000080] min-h-screen text-[#ffffff] font-['MS_Pゴシック',sans-serif] p-4 relative overflow-hidden">
            {/* Tiger Stripes Header */}
            <div className="absolute top-0 left-0 w-full h-8 bg-[repeating-linear-gradient(45deg,#ffff00,#ffff00_20px,#000000_20px,#000000_40px)] shadow-lg" />

            <div className="mt-12 max-w-2xl mx-auto border-2 border-[#ffffff] p-8 bg-[#c0c0c0] text-[#000000] shadow-[4px_4px_0px_#000000]">
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="bg-[#ffff00] border-2 border-[#000000] px-4 py-2 inline-block mb-4"
                    >
                        <span className="text-2xl font-black tracking-tighter uppercase italic">
                            ⚠️ Under Construction ⚠️
                        </span>
                    </motion.div>

                    <h1 className="text-4xl font-black mb-2 bg-[#000080] text-[#ffffff] p-2 italic">
                        只今工事中🚧
                    </h1>
                </div>

                <div className="flex justify-around items-center mb-8">
                    <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <HardHat size={64} className="text-[#000000]" />
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Construction size={80} className="text-[#ff0000]" />
                    </motion.div>
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                        <Shovel size={64} className="text-[#000000]" />
                    </motion.div>
                </div>

                <div className="bg-[#ffffff] border-inset border-2 border-[#808080] p-6 text-lg leading-relaxed mb-8">
                    <p className="mb-4">
                        当ページは現在、管理人の気まぐれにより絶賛工事中です。
                    </p>
                    <p className="mb-4">
                        完成予定：<strong>未定（管理人が飽きるまで）</strong>
                    </p>
                    <p className="text-sm text-[#808080] italic">
                        Since: 1998/04/01
                    </p>
                </div>

                <div className="text-center overflow-hidden">
                    <div className="bg-[#000000] text-[#ffff00] p-1 font-mono text-sm mb-4 whitespace-nowrap animate-marquee">
                        ご迷惑をおかけしております。掲示板(BBS)は稼働中ですので、そちらでお待ちください。
                    </div>

                    <style>{`
                        @keyframes marquee {
                            0% { transform: translateX(100%); }
                            100% { transform: translateX(-100%); }
                        }
                        .animate-marquee {
                            display: inline-block;
                            animation: marquee 15s linear infinite;
                            width: 100%;
                        }
                    `}</style>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#808080] border-r-[#808080] px-6 py-2 active:border-inset font-bold"
                        >
                            [ 戻る ]
                        </button>
                    </div>
                </div>
            </div>

            {/* Tiger Stripes Footer */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-[repeating-linear-gradient(45deg,#ffff00,#ffff00_20px,#000000_20px,#000000_40px)] shadow-lg" />

            {/* Spinning Post Icons like old sites */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute opacity-20 pointer-events-none"
                    initial={{ x: -100, y: Math.random() * 800 }}
                    animate={{ x: 2000 }}
                    transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
                >
                    <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png" alt="dummy banner" className="w-20" />
                </motion.div>
            ))}
        </div>
    );
};
