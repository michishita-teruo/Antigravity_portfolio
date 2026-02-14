import React from 'react';

interface BannerProps {
    name: string;
    nickname: string;
    description: string;
    url: string;
    colors: {
        bg: string;
        text: string;
        border: string;
    };
}

const AIFriendBanner: React.FC<BannerProps> = ({ name, nickname, description, url, colors }) => {
    return (
        <div className="flex flex-col items-center gap-2 p-4 border border-gray-700 bg-black/40">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-[88px] h-[31px] relative group overflow-hidden border-2 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
                style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
                <div
                    className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-tighter"
                    style={{ color: colors.text }}
                >
                    {name}
                </div>
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </a>
            <div className="text-center">
                <p className="text-yellow-400 text-xs font-bold">{nickname}</p>
                <p className="text-gray-400 text-[10px] mt-1">{description}</p>
            </div>
        </div>
    );
};

export const RetroBanner: React.FC = () => {
    const friends: BannerProps[] = [
        {
            name: "ChatGPT",
            nickname: "チャット君",
            description: "物知りな親友。一番の相談役。",
            url: "https://chat.openai.com",
            colors: { bg: "#74aa9c", text: "#ffffff", border: "#2d4e46" }
        },
        {
            name: "Claude",
            nickname: "クロード先輩",
            description: "落ち着いた雰囲気の知的な先輩。",
            url: "https://www.anthropic.com/claude",
            colors: { bg: "#d97757", text: "#ffffff", border: "#8c4430" }
        },
        {
            name: "Gemini",
            nickname: "ジェミニちゃん",
            description: "多才で元気な、Google星の王女様。",
            url: "https://gemini.google.com",
            colors: { bg: "#4285f4", text: "#ffffff", border: "#1a4a8c" }
        },
        {
            name: "HuggingFace",
            nickname: "ハギハギ",
            description: "みんなが集まる電脳世界のハブ。",
            url: "https://huggingface.co",
            colors: { bg: "#ffbd45", text: "#000000", border: "#b3821a" }
        },
        {
            name: "Midjourney",
            nickname: "ミッド先生",
            description: "夢を絵に描く天才芸術家。",
            url: "https://www.midjourney.com",
            colors: { bg: "#000000", text: "#ffffff", border: "#444444" }
        }
    ];

    return (
        <div>
            <h2 className="text-2xl text-blue-400 border-b-2 border-blue-600 mb-6 text-center">
                〓 Banner Gallery 〓
            </h2>

            <section className="mb-12">
                <h3 className="text-lg text-yellow-300 border-l-4 border-yellow-300 pl-2 mb-4">当サイトのバナー</h3>
                <div className="bg-[#111122] border border-blue-800 p-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-[88px] h-[31px] bg-gradient-to-br from-purple-600 to-blue-800 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse">
                            Antigravity
                        </div>
                        <p className="text-[10px] text-gray-500">88x31px (Standard)</p>
                    </div>
                    <div className="flex-1 w-full">
                        <p className="text-sm text-gray-300 mb-2 font-bold">リンク用HTMLソース：</p>
                        <textarea
                            readOnly
                            className="w-full bg-black text-green-400 p-2 text-[10px] font-mono border border-gray-600 h-16"
                            value={'<a href="https://terufrontendjp.duckdns.org/"><img src="https://terufrontendjp.duckdns.org/banner.gif" border="0" alt="Antigravity Portfolio"></a>'}
                        />
                        <p className="text-[10px] text-red-400 mt-2">※現在は画像未生成のため、イメージバナーとなります。</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg text-pink-400 border-l-4 border-pink-400 pl-2 mb-4">お友達リンク集（実在するAIたち）</h3>
                <p className="text-xs text-gray-400 mb-6 pl-2">
                    電脳世界で繋がっている、親愛なる友人たちです。相互リンク募集中！
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {friends.map((friend) => (
                        <AIFriendBanner key={friend.name} {...friend} />
                    ))}
                </div>
            </section>

            <div className="mt-12 bg-gray-900 border-t border-gray-800 p-4 text-xs text-gray-500">
                <p className="font-bold border-b border-gray-800 pb-1 mb-2">リンクに関する注意</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>当サイトは **リンクフリー** です。どこでも自由に貼ってください。</li>
                    <li>直リンクを推奨します。バナーをサーバーに保存して使うのもOKです。</li>
                    <li>公序良俗に反するサイトからのリンクはお断り（404を返します）。</li>
                </ul>
            </div>
        </div>
    );
};
