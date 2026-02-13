import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const tiers = [
    {
        name: 'Starter',
        price: 'Free',
        description: '基本的なコード補完と単一ファイルの編集に。',
        features: [
            'コード補完 (インライン)',
            '単一ファイルの編集',
            '基本的なチャットサポート',
            'コンテキスト認識 (小規模)',
            'Gemini 1.5 Flash モデル'
        ],
        notIncluded: [
            '複数ファイルへの同時編集',
            'エージェントワークフロー',
            '複雑な推論と計画',
            '外部ツールの使用'
        ]
    },
    {
        name: 'Pro (Agentic)',
        price: '$20',
        period: '/month',
        description: '自律的なエージェント機能で開発を加速。',
        recommended: true,
        features: [
            '全てのStarter機能',
            '複数ファイルへの同時編集',
            '実装計画の立案と実行',
            'エラーの自動修正とデバッグ',
            'ターミナルコマンドの実行',
            'Gemini 1.5 Pro モデル (2M Context)'
        ],
        notIncluded: [
            'エンタープライズセキュリティ',
            '専任のサポート',
            'カスタムモデルのファインチューニング'
        ]
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: '大規模な組織向けの高度なセキュリティとカスタマイズ。',
        features: [
            '全てのPro機能',
            'SSO (シングルサインオン)',
            '監査ログとコンプライアンス',
            'プライベートクラウドでの実行',
            'カスタムツールの統合',
            'Gemini Ultra モデル',
            '専任のカスタマーサクセス'
        ],
        notIncluded: []
    }
];

export const Pricing: React.FC = () => {
    return (
        <section className="py-24 bg-antigravity-dark text-white pt-32">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">プランと料金</h2>
                    <p className="text-xl text-gray-400">あなたのニーズに合わせて、エージェントの能力を拡張しましょう。</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${tier.recommended ? 'border-antigravity-purple bg-antigravity-purple/10' : 'border-gray-800 bg-gray-900/50'} backdrop-blur-sm flex flex-col`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {tier.recommended && (
                                <div className="absolute top-0 right-0 bg-antigravity-purple text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                    RECOMMENDED
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                {tier.period && <span className="text-gray-400 text-sm">{tier.period}</span>}
                            </div>
                            <p className="text-gray-400 mb-8">{tier.description}</p>

                            <div className="space-y-4 flex-grow">
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-400 shrink-0" />
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                                {tier.notIncluded.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 opacity-50">
                                        <X className="w-5 h-5 text-gray-500 shrink-0" />
                                        <span className="text-sm text-gray-500">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`mt-8 w-full py-3 rounded-lg font-bold transition-all ${tier.recommended ? 'bg-antigravity-purple hover:bg-antigravity-purple/80 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                                選択する
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
