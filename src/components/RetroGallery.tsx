import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface GalleryItem {
    id: string;
    title: string;
    description: string;
    details: string;
    imageUrl: string;
    createdAt?: any;
}

export const RetroGallery: React.FC = () => {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'gallery'), orderBy('id', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const galleryData: GalleryItem[] = [];
            snapshot.forEach((doc) => {
                galleryData.push({ id: doc.id, ...doc.data() } as GalleryItem);
            });
            setItems(galleryData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-[#000033] p-4 text-white leading-relaxed" style={{ fontFamily: '"MS PGothic", "MS Pゴシック", sans-serif' }}>
            <div className="text-center mb-6">
                <div className="bg-[#000080] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] py-1 mb-2">
                    <h2 className="text-xl font-bold tracking-[0.2em] text-yellow-300">
                        ☆ 管理人の日記アート展示室 ☆
                    </h2>
                </div>
                <p className="text-[10px] text-red-500 font-bold bg-white inline-block px-2">無断転載・直リンク禁止！</p>
            </div>

            <p className="text-xs mb-8 border border-dotted border-white p-2">
                管理人が綴ってきた「日記」の想いを、視覚化した展示スペースです。<br />
                画像をクリックしても拡大はしません（笑）
            </p>

            {loading ? (
                <div className="text-center p-10 font-mono text-sm animate-pulse">
                    LOADING GALLERY DATA... <br />
                    NOW CONNECTING TO FIREBASE STORAGE
                </div>
            ) : (
                <table className="w-full border-collapse border-2 border-[#808080] bg-[#c0c0c0] text-black">
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item.id} className="border-b border-[#808080]">
                                <td className="w-48 p-2 align-middle border-r border-[#808080] bg-white">
                                    <div className="border border-black p-0.5">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-auto" />
                                    </div>
                                    <p className="text-[9px] mt-1 text-center font-mono">ID: ART-{item.id.padStart(3, '0')}</p>
                                </td>
                                <td className="p-3 align-top text-xs">
                                    <p className="font-bold underline text-blue-900 mb-2">『{item.title}』</p>
                                    <p className="mb-4 leading-normal">{item.description}</p>
                                    <div className="text-[9px] text-gray-700 border-t border-dashed border-gray-400 pt-1">
                                        {item.details}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} className="p-8 text-center text-xs text-gray-600">
                                    作品はまだ展示されていません。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div className="mt-12 text-center space-y-4">
                <p className="text-xs text-blue-300 italic">"The logs become light, and the light becomes code."</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] px-6 py-1 text-xs font-bold active:border-inset"
                    >
                        [&lt;&lt; 戻る]
                    </button>
                </div>
            </div>
        </div>
    );
};
