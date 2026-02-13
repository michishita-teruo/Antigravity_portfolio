import React from 'react';

export const RetroLink: React.FC = () => {
    return (
        <div className="text-gray-300 font-serif">
            <h2 className="text-2xl text-cyan-400 border-b-2 border-cyan-600 mb-6 text-center">
                ★☆★ Links ★☆★
            </h2>

            <div className="mb-8 p-4 border border-gray-600 bg-[#111]">
                <h3 className="text-yellow-300 text-lg mb-2">★ 当サイトへのリンクについて</h3>
                <p className="text-sm text-gray-300 mb-2">
                    当サイトはリンクフリーです。報告不要です。<br />
                    バナーは必ずダウンロードして使ってください（直リンク禁止！！）
                </p>
                <div className="flex gap-4 items-center mt-4">
                    <div className="w-[88px] h-[31px] bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold border border-white">
                        Antigravity
                    </div>
                    <div className="text-xs text-gray-400 font-mono bg-black p-1 border border-gray-800">
                        &lt;a href="https://antigravity.dev"&gt;&lt;img src="banner.gif"&gt;&lt;/a&gt;
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-lg text-pink-400 mb-2 border-l-4 border-pink-400 pl-2">★ Respect</h3>
                    <ul className="list-disc pl-6 space-y-1 text-blue-300 text-sm">
                        <li><a href="https://deepmind.google/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Google DeepMind</a> - 生みの親。神。</li>
                        <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">React</a> - これがないと始まらない。</li>
                        <li><a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Tailwind CSS</a> - 便利なCSS。</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg text-green-400 mb-2 border-l-4 border-green-400 pl-2">★ Friends (Mutual Links)</h3>
                    <p className="text-gray-500 text-xs mb-2">※相互リンク募集中です！BBSまで連絡ください。</p>
                    <ul className="list-disc pl-6 space-y-1 text-blue-300 text-sm">
                        <li><a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Vite使いの憂鬱</a> (Vite公式サイト)</li>
                        <li><a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">TypeScript勉強中...</a> (TS公式サイト)</li>
                        <li><a href="https://www.irasutoya.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">★☆★ 爆走Web素材館 ★☆★</a> (いらすとや)</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg text-yellow-500 mb-2 border-l-4 border-yellow-500 pl-2">★ Search Engines</h3>
                    <ul className="list-disc pl-6 space-y-1 text-blue-300 text-sm">
                        <li><a href="https://www.yahoo.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Yahoo! JAPAN</a></li>
                        <li><a href="https://www.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Google</a></li>
                        <li><a href="https://www.infoseek.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Infoseek</a></li>
                        <li><a href="https://www.lycos.com/" target="_blank" rel="noopener noreferrer" className="hover:text-red-400">Lycos</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
