import React from 'react';

interface GalleryItem {
    id: number;
    title: string;
    comment: string;
    software: string;
    date: string;
    size: string;
    dimensions: string;
}

const galleryData: GalleryItem[] = [
    {
        id: 1,
        title: "未来の電脳都市",
        comment: "初めてレイトレーシングに挑戦しました。光の反射が難しかったです…。重いので注意してください。",
        software: "Photoshop 4.0 / Bryce 3D",
        date: "2026/02/01",
        size: "42.5 KB",
        dimensions: "640x480"
    },
    {
        id: 2,
        title: "夕暮れの山脈",
        comment: "16色ドット絵です。透過GIFにするのが大変でした。バナーに使っていいですよ！(報告必須)",
        software: "EDGE / ペイント",
        date: "2026/01/15",
        size: "8.2 KB",
        dimensions: "88x31"
    },
    {
        id: 3,
        title: "管理人の秘密の部屋",
        comment: "CASIOのデジカメで撮りました。画質は悪いですが味があります（笑）電球が切れかかってます。",
        software: "QV-10 / PhotoDeluxe",
        date: "2026/01/20",
        size: "25.1 KB",
        dimensions: "320x240"
    }
];

export const RetroGallery: React.FC = () => {
    return (
        <div className="bg-[#000033] p-4 border-2 border-[#ffffff] min-h-full" style={{ fontFamily: '"MS PGothic", "MS Pゴシック", sans-serif', color: '#ffffff' }}>
            <div className="text-center mb-6">
                <div className="bg-[#000080] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000040] border-r-[#000040] py-1 mb-4">
                    <h2 className="text-xl font-bold tracking-widest text-yellow-300 transform scale-y-110">
                        ☆★☆ イラスト展示室 (Gallery) ☆★☆
                    </h2>
                </div>
                <p className="text-xs mt-2 text-[#ffff00] font-bold animate-pulse">
                    ※無断転載厳禁・直リンク禁止！※<br />
                    お持ち帰りは必ず <a href="/retro/bbs" className="underline text-blue-400">BBS</a> か <a href="/retro/mail" className="underline text-blue-400">メール</a> で報告をお願いします。
                </p>
            </div>

            <div className="text-xs border-2 border-double border-[#ffffff] p-2 mb-6 leading-relaxed bg-[#000044] text-white">
                <p>Welcome to my gallery room...</p>
                <p>拙作の画像たちです。暇な時にポツポツ作っています。</p>
                <p>Netscape Navigator 4.0 以上での閲覧を推奨します（笑）</p>
            </div>

            <div className="space-y-8">
                {galleryData.map((item) => (
                    <div key={item.id} className="border-2 border-[#808080] bg-[#c0c0c0] p-1 shadow-[4px_4px_0px_#000000]">
                        <table className="w-full border-collapse bg-[#ffffff] text-[#000000]">
                            <tbody>
                                <tr>
                                    <td className="w-1/3 border border-[#808080] p-4 text-center align-middle bg-[#dfdfdf]">
                                        <div className="border border-[#000000] p-1 bg-white inline-block">
                                            {/* Using Picsum for more reliability in dev environment, adding greyscale/blur for retro feel */}
                                            <img
                                                src={`https://picsum.photos/seed/${item.id}/300/200?grayscale`}
                                                alt={item.title}
                                                className="max-w-full h-auto border border-[#808080]"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="text-[9px] mt-2 text-[#666666] font-mono whitespace-nowrap overflow-hidden">
                                            &lt; IMAGE_DATA: {item.id} &gt;
                                        </div>
                                    </td>
                                    <td className="border border-[#808080] p-3 align-top text-xs relative overflow-hidden">
                                        {/* Classic "New" icon feel if needed */}
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-sm text-[#000080] border-b border-[#000080] pb-0.5">
                                                No.{item.id} - 『{item.title}』
                                            </p>
                                            <span className="bg-red-600 text-white text-[9px] px-1 font-bold italic animate-bounce">NEW!</span>
                                        </div>

                                        <div className="mb-3 leading-relaxed min-h-[4em]">
                                            {item.comment}
                                        </div>

                                        <div className="bg-[#f0f0f0] border border-[#808080] p-1.5 text-[10px] space-y-0.5 font-mono text-[#444444]">
                                            <p><span className="text-[#000080]">TOOL:</span> {item.software}</p>
                                            <p><span className="text-[#000080]">SIZE:</span> {item.dimensions} ({item.size})</p>
                                            <p><span className="text-[#000080]">DATE:</span> {item.date}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <div className="mb-6">
                    <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW55bGd4eW55bGd4eW55bGd4eW55bGd4eW55bGd4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2r33c7C6g8V2/giphy.gif"
                        alt="construction"
                        className="inline-block h-8 mx-2"
                    />
                    <span className="text-xs text-blue-300">更新停滞中…ごめんなさい！</span>
                    <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3R6eW55bGd4eW55bGd4eW55bGd4eW55bGd4eW55bGd4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2r33c7C6g8V2/giphy.gif"
                        alt="construction"
                        className="inline-block h-8 mx-2"
                    />
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] px-6 py-1 text-sm font-bold text-black hover:bg-[#d0d0d0] active:translate-y-0.5"
                    >
                        [&lt;&lt; 戻る]
                    </button>
                    <a
                        href="/retro"
                        className="bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-b-[#000000] border-r-[#000000] px-6 py-1 text-sm font-bold text-black hover:bg-[#d0d0d0] active:translate-y-0.5 inline-block no-underline"
                    >
                        [HOME]
                    </a>
                </div>

                <p className="mt-8 text-[10px] text-gray-400">
                    Best viewed with IE 5.5 / Netscape 4.7 at 800x600 resolution.
                </p>
            </div>
        </div>
    );
};
