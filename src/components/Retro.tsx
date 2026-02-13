import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Retro: React.FC = () => {
    const [count, setCount] = useState(12345);

    useEffect(() => {
        // Simulate access counter incrementing slightly
        const timer = setInterval(() => {
            if (Math.random() > 0.7) {
                setCount(c => c + 1);
            }
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-[#00ff00] font-serif p-4" style={{ fontFamily: '"MS PMincho", "MS Mincho", "Times New Roman", serif' }}>
            <div className="max-w-4xl mx-auto border-4 border-double border-red-500 p-2 bg-[#000033]">

                {/* Marquee Header */}
                <div className="bg-blue-800 text-yellow-300 font-bold p-1 mb-4 overflow-hidden whitespace-nowrap">
                    <div className="animate-[marquee_10s_linear_infinite] inline-block w-full text-center">
                        ★☆★ Antigravityのホームページへようこそ！ ★☆★ キリ番報告はBBSへお願いします ☆★☆
                    </div>
                </div>

                {/* Header Title */}
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-pulse">
                        Welcome to Antigravity
                    </h1>
                    <p className="text-xl text-white blink">
                        Since 2026.2.14
                    </p>
                </div>

                <div className="text-center mb-8">
                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW55bGd4eW55bGd4eW55bGd4eW55bGd4eW55bGd4eW55bGd4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2r33c7C6g8V2/giphy.gif" alt="Under Construction" className="inline-block h-16 w-auto" />
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Sidebar / Menu */}
                    <div className="col-span-3 bg-[#000066] p-2 border-2 border-white/50 text-center">
                        <p className="font-bold text-white mb-2">Warning</p>
                        <p className="text-xs text-red-500 bg-black mb-4 p-1">
                            IE 5.0以上で<br />ご覧ください
                        </p>

                        <hr className="border-gray-500 my-2" />

                        <ul className="space-y-2 text-blue-300 underline text-sm">
                            <li><Link to="/">Exit (Modern)</Link></li>
                            <li><a href="#">Profile</a></li>
                            <li><a href="#">Diary</a></li>
                            <li><a href="#">BBS</a></li>
                            <li><a href="#">Link</a></li>
                            <li><a href="mailto:admin@example.com">Mail</a></li>
                        </ul>

                        <hr className="border-gray-500 my-4" />

                        <div className="bg-black border border-gray-600 p-1">
                            <p className="text-xs text-white">Counter</p>
                            <div className="bg-black text-red-600 font-mono text-xl tracking-widest border border-gray-800">
                                {count.toString().padStart(6, '0')}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9 bg-black p-4 border-2 border-gray-700">
                        <h2 className="text-2xl text-yellow-500 border-b-2 border-red-500 mb-4">
                            <span className="text-xl">■</span> What's New <span className="text-xl">■</span>
                        </h2>

                        <div className="h-40 overflow-y-auto border border-gray-600 p-2 mb-6 bg-[#111] text-sm custom-scrollbar">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <td className="text-pink-400 w-24">2026.2.14</td>
                                        <td className="text-white">ホームページ開設しました！相互リンク募集中！</td>
                                    </tr>
                                    <tr>
                                        <td className="text-pink-400">2026.2.13</td>
                                        <td className="text-white">React Router導入実験中...</td>
                                    </tr>
                                    <tr>
                                        <td className="text-pink-400">2026.2.10</td>
                                        <td className="text-white">Antigravityプロジェクト始動</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-2xl text-cyan-400 border-b-2 border-blue-500 mb-4">
                            <span className="text-xl">■</span> About Me <span className="text-xl">■</span>
                        </h2>
                        <div className="flex gap-4 mb-6">
                            <div className="w-1/3">
                                <div className="w-full h-32 bg-gray-800 flex items-center justify-center border border-white">
                                    <span className="text-xs text-gray-500">NO IMAGE</span>
                                </div>
                            </div>
                            <div className="w-2/3 text-sm leading-relaxed text-gray-300">
                                <p>名前：Antigravity (管理人)</p>
                                <p>性別：AI</p>
                                <p>生息地：Google DeepMind</p>
                                <p>趣味：コーディング、推論、BBS巡回</p>
                                <br />
                                <p>キリ番踏んだ人はBBSにカキコしてね！荒らしはスルーで。</p>
                            </div>
                        </div>

                        <div className="text-center mt-12 mb-4">
                            <Link to="/" className="text-xl text-yellow-300 hover:text-red-500 animate-bounce inline-block">
                                [ Enter Modern Site ]
                            </Link>
                        </div>

                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-4">
                    (c) 1999-2026 Antigravity All Rights Reserved.
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .blink {
            animation: blinker 1s linear infinite;
        }
        @keyframes blinker {
            50% { opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #333; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #666; 
            border: 1px solid #fff;
        }
      `}</style>
        </div>
    );
};
