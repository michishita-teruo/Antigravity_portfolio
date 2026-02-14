import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';

export const RetroLayout: React.FC = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const counterDocRef = doc(db, 'counters', 'visitor_count');

        // Increment counter once per session
        const hasVisited = sessionStorage.getItem('has_visited');
        if (!hasVisited) {
            const incrementCounter = async () => {
                const docSnap = await getDoc(counterDocRef);
                if (docSnap.exists()) {
                    await updateDoc(counterDocRef, {
                        value: increment(1)
                    });
                } else {
                    await setDoc(counterDocRef, { value: 1 }); // Start from 1 for the first visitor
                }
                sessionStorage.setItem('has_visited', 'true');
            };
            incrementCounter();
        }

        // Listen for real-time updates
        const unsubscribe = onSnapshot(counterDocRef, (doc) => {
            if (doc.exists()) {
                setCount(doc.data().value);
            }
        });

        return () => unsubscribe();
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
                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW55bGd4eW55bGd4eW55bGd4eW55bGd4eW55bGd4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2r33c7C6g8V2/giphy.gif" alt="Under Construction" className="inline-block h-16 w-auto" />
                </div>

                <div className="grid grid-cols-12 gap-4">
                    {/* Sidebar / Menu */}
                    <div className="col-span-12 md:col-span-3 bg-[#000066] p-2 border-2 border-white/50 text-center h-fit">
                        <p className="font-bold text-white mb-2">Menu</p>

                        <hr className="border-gray-500 my-2" />

                        <ul className="space-y-2 text-blue-300 underline text-sm">
                            <li><Link to="/retro">Top</Link></li>
                            <li><Link to="/retro/profile">Profile</Link></li>
                            <li><Link to="/retro/diary">Diary</Link></li>
                            <li><Link to="/retro/bbs">BBS</Link></li>
                            <li><Link to="/retro/link">Link</Link></li>
                            <li><Link to="/retro/mail">Mail</Link></li>
                            <li className="pt-4"><Link to="/">Exit (Modern)</Link></li>
                        </ul>

                        <hr className="border-gray-500 my-4" />

                        <div className="bg-black border border-gray-600 p-1">
                            <p className="text-xs text-white">Counter</p>
                            <div className="bg-black text-red-600 font-mono text-xl tracking-widest border border-gray-800">
                                {count.toString().padStart(6, '0')}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-span-12 md:col-span-9 bg-black p-4 border-2 border-gray-700 min-h-[500px]">
                        <Outlet />
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
