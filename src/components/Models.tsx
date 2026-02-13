import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Sparkles } from 'lucide-react';

const models = [
    {
        id: 'flash',
        name: 'Gemini 1.5 Flash',
        icon: <Zap className="w-12 h-12 text-yellow-400" />,
        color: 'from-yellow-400/20 to-orange-500/20',
        description: '高速、軽量、そして効率的。',
        details: '低遅延が求められるタスクや、大量の単純なリクエスト処理に最適です。コスト効率が高く、日常的なコード補完や簡単な質問応答に威力を発揮します。',
        specs: ['1M Context Window', 'High Throughput', 'Multimodal']
    },
    {
        id: 'pro',
        name: 'Gemini 1.5 Pro',
        icon: <Brain className="w-12 h-12 text-antigravity-purple" />,
        color: 'from-antigravity-purple/20 to-blue-600/20',
        description: '中核となる推論エンジン。',
        details: '複雑な推論、コーディング、計画立案におけるバランスの取れたモデル。200万トークンのコンテキストウィンドウにより、大規模なコードベース全体を理解し、修正を加えることができます。',
        specs: ['2M Context Window', 'Complex Reasoning', 'Code Specialist']
    },
    {
        id: 'ultra',
        name: 'Gemini Ultra',
        icon: <Sparkles className="w-12 h-12 text-pink-500" />,
        color: 'from-pink-500/20 to-rose-600/20',
        description: '最先端の能力を持つ、最大かつ最強のモデル。',
        details: '非常に高度なタスク、創造的な問題解決、そして深遠な理解が必要な場合に。科学的な発見や、前例のない新しいアルゴリズムの実装をサポートします。',
        specs: ['State-of-the-art Performance', 'Advanced Math/Logic', 'Deep Understanding']
    }
];

export const Models: React.FC = () => {
    return (
        <section className="py-24 bg-antigravity-dark text-white pt-32">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">知能の源泉</h2>
                    <p className="text-xl text-gray-400">Google DeepMindの最新モデルが、Antigravityを駆動します。</p>
                </motion.div>

                <div className="space-y-24">
                    {models.map((model) => (
                        <motion.div
                            key={model.id}
                            className="flex flex-col md:flex-row gap-12 items-center"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className={`w-full md:w-1/2 aspect-square md:aspect-video rounded-3xl bg-gradient-to-br ${model.color} flex items-center justify-center relative overflow-hidden group`}>
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                                <div className="relative z-10 p-8 rounded-full bg-black/50 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    {model.icon}
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 space-y-6">
                                <h3 className="text-3xl font-bold">{model.name}</h3>
                                <p className="text-xl font-medium text-white/80">{model.description}</p>
                                <p className="text-gray-400 leading-relaxed">{model.details}</p>

                                <div className="flex flex-wrap gap-3 pt-4">
                                    {model.specs.map((spec, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full border border-white/10 text-sm text-gray-300 bg-white/5">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
