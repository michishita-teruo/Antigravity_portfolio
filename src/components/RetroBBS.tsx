import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

type Post = {
    id: string;
    name: string;
    email: string;
    title: string;
    message: string;
    date: string;
    color: string;
    createdAt?: Timestamp;
};


export const RetroBBS: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [honeypot, setHoneypot] = useState(''); // Anti-bot hidden field

    // Load from Firestore (Real-time)
    useEffect(() => {
        const q = query(collection(db, 'bbs_posts'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData: Post[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                postsData.push({
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    title: data.title,
                    message: data.message,
                    date: data.date,
                    color: data.color,
                    createdAt: data.createdAt
                });
            });
            setPosts(postsData);
        }, (error) => {
            console.error("Error fetching posts:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Security Check 1: Honeypot
        if (honeypot) {
            console.log('Bot detected!');
            return; // Silently fail
        }

        // Security Check 2: Rate Limiting (Local only for simplicity)
        const lastPostTime = localStorage.getItem('retro_bbs_last_post_time');
        const now = Date.now();
        if (lastPostTime && now - parseInt(lastPostTime) < 30000) { // 30 seconds limit
            alert('多重書き込み禁止！少し時間を空けてください。（連投規制中）');
            return;
        }

        if (!name || !message) {
            alert('名前とメッセージは必須です！');
            return;
        }

        const dateStr = new Date().toLocaleString('ja-JP');

        try {
            await addDoc(collection(db, 'bbs_posts'), {
                name: name || '名無しさん',
                email,
                title: title || '無題',
                message,
                date: dateStr,
                color,
                createdAt: serverTimestamp()
            });

            localStorage.setItem('retro_bbs_last_post_time', now.toString());

            // Reset form
            setName('');
            setEmail('');
            setTitle('');
            setMessage('');
            alert('書き込みました！');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('エラーが発生しました。時間を空けてもう一度お試しください。');
        }
    };

    return (
        <div>
            <h2 className="text-2xl text-green-400 border-b-2 border-green-600 mb-6 text-center">
                ★☆★ 掲示板 ★☆★
            </h2>

            <div className="text-center text-xs text-red-400 mb-4 bg-white/10 p-2 border border-red-500">
                注意：荒らし、誹謗中傷、出会い目的の書き込みは禁止です！！<br />
                ※当BBSはセキュリティ対策（連投規制・Bot検知）が導入されています。
            </div>

            {/* Post Form */}
            <div className="bg-[#003300] border-2 border-green-700 p-4 mb-8 text-sm">
                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Honeypot Field (Hidden) */}
                    <input
                        type="text"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        style={{ display: 'none' }}
                        autoComplete="off"
                    />

                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="w-20 text-green-300">名前：</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-black border border-green-500 text-white px-1 w-full md:w-64" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="w-20 text-green-300">E-mail：</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black border border-green-500 text-white px-1 w-full md:w-64" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="w-20 text-green-300">題名：</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black border border-green-500 text-white px-1 w-full md:w-64" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="w-20 text-green-300">文字色：</label>
                        <select value={color} onChange={(e) => setColor(e.target.value)} className="bg-black border border-green-500 text-white px-1">
                            <option value="#ffffff">白</option>
                            <option value="#ff0000">赤</option>
                            <option value="#00ff00">緑</option>
                            <option value="#0000ff">青</option>
                            <option value="#ffff00">黄</option>
                            <option value="#ff00ff">紫</option>
                        </select>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="w-20 text-green-300">内容：</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="bg-black border border-green-500 text-white px-1 w-full" />
                    </div>
                    <div className="text-center mt-4">
                        <button type="submit" className="bg-gray-300 text-black border-2 border-white px-4 py-1 font-bold hover:bg-white">
                            送信する
                        </button>
                        <button type="reset" onClick={() => { setName(''); setMessage(''); setEmail(''); setTitle(''); }} className="ml-4 bg-gray-300 text-black border-2 border-white px-4 py-1 font-bold hover:bg-white">
                            リセット
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts List */}
            <div className="space-y-8">
                {posts.map((post) => (
                    <div key={post.id} className="mb-4">
                        <div className="text-green-300 border-b border-green-800 pb-1 mb-2 text-sm">
                            [<b>{post.id}</b>]
                            <span className="text-yellow-300 font-bold mx-2"> {post.title} </span>
                            Name：<b>{post.email ? <a href={`mailto:${post.email}`} className="text-blue-400 underline">{post.name}</a> : <span className="text-green-500">{post.name}</span>}</b>
                            <span className="ml-4 text-xs text-gray-500">Date：{post.date}</span>
                        </div>
                        <div className="pl-4 text-sm whitespace-pre-wrap" style={{ color: post.color }}>
                            {post.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
