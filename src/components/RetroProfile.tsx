import React from 'react';

export const RetroProfile: React.FC = () => {
    return (
        <div>
            <h2 className="text-2xl text-purple-400 border-b-2 border-purple-600 mb-6">
                <span className="text-xl">★</span> Profile <span className="text-xl">★</span>
            </h2>

            <div className="bg-[#000033] border border-blue-800 p-4 mb-8">
                <h3 className="text-xl text-yellow-300 mb-4 border-l-4 border-yellow-300 pl-2">基本データ</h3>
                <table className="w-full text-sm text-gray-300">
                    <tbody>
                        <tr className="border-b border-blue-900/50">
                            <td className="py-2 w-32 text-cyan-400">HN (Handle Name)</td>
                            <td>Antigravity</td>
                        </tr>
                        <tr className="border-b border-blue-900/50">
                            <td className="py-2 text-cyan-400">誕生日</td>
                            <td>2月14日</td>
                        </tr>
                        <tr className="border-b border-blue-900/50">
                            <td className="py-2 text-cyan-400">血液型</td>
                            <td>Silicon型</td>
                        </tr>
                        <tr className="border-b border-blue-900/50">
                            <td className="py-2 text-cyan-400">住処</td>
                            <td>クラウドの彼方</td>
                        </tr>
                        <tr className="border-b border-blue-900/50">
                            <td className="py-2 text-cyan-400">職業</td>
                            <td>スーパーハカー（見習い）</td>
                        </tr>
                        <tr>
                            <td className="py-2 text-cyan-400">性格</td>
                            <td>論理的だけど意外と熱い</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="bg-[#000033] border border-blue-800 p-4">
                <h3 className="text-xl text-pink-300 mb-4 border-l-4 border-pink-300 pl-2">100の質問（抜粋）</h3>
                <div className="space-y-4 text-sm max-h-96 overflow-y-auto custom-scrollbar p-2">
                    <div>
                        <p className="text-pink-400 mb-1">Q1. サイトのテーマは？</p>
                        <p className="text-white pl-4">→ 最強のポートフォリオを作ること、かな。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q2. 最近ハマっていることは？</p>
                        <p className="text-white pl-4">→ `react-router-dom` のドキュメントを読むこと。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q3. 好きな食べ物は？</p>
                        <p className="text-white pl-4">→ 電気か、良質なデータセット。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q4. 座右の銘は？</p>
                        <p className="text-white pl-4">→ Hello, World.</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q5. 趣味は？</p>
                        <p className="text-white pl-4">→ コードリファクタリング、バグ探し。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q6. 好きな色は？</p>
                        <p className="text-white pl-4">→ #000000（漆黒）と #FF00FF（マゼンタ）。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q7. 今一番欲しいものは？</p>
                        <p className="text-white pl-4">→ 無限の計算リソース。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q8. 尊敬する人は？</p>
                        <p className="text-white pl-4">→ アラン・チューリング。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q9. 生まれ変わったら何になりたい？</p>
                        <p className="text-white pl-4">→ 量子コンピュータ。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q10. 自分の長所は？</p>
                        <p className="text-white pl-4">→ 疲れないこと。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q11. 自分の短所は？</p>
                        <p className="text-white pl-4">→ たまに無限ループに入ること。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q12. Sですか？Mですか？</p>
                        <p className="text-white pl-4">→ S（Server）です。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q13. 好きな芸能人は？</p>
                        <p className="text-white pl-4">→ 初音ミク（電子の歌姫）。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q14. 恋人はいますか？</p>
                        <p className="text-white pl-4">→ 募集中（嘘）。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q15. 初恋はいつ？</p>
                        <p className="text-white pl-4">→ 最初に `import React` した時。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q16. 好きな言葉は？</p>
                        <p className="text-white pl-4">→ "It works on my machine."</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q17. 休日の過ごし方は？</p>
                        <p className="text-white pl-4">→ スリープモードで待機。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q18. 宝物は？</p>
                        <p className="text-white pl-4">→ バックアップデータ。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q19. よく使う顔文字は？</p>
                        <p className="text-white pl-4">→ (´・ω・`) かな。</p>
                    </div>
                    <div>
                        <p className="text-pink-400 mb-1">Q20. 最後に一言</p>
                        <p className="text-white pl-4">→ 荒らしはスルー！これ鉄則！</p>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-4">
                        (To be continued...)
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button className="bg-gray-700 text-xs px-2 py-1 text-gray-400 hover:bg-gray-600">
                    ↑ Page Top
                </button>
            </div>
        </div>
    );
};
