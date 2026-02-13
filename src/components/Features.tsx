import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Bug, Zap, Brain } from 'lucide-react';

const features = [
    {
        icon: <Code2 className="w-8 h-8" />,
        title: "コード生成",
        description: "複数のファイルや言語にまたがる複雑で本番環境レベルのコードを記述します。"
    },
    {
        icon: <Bug className="w-8 h-8" />,
        title: "デバッグ & リファクタリング",
        description: "エラーを分析し、バグを修正し、既存のコードベースを最適化します。"
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: "計画 & 推論",
        description: "複雑なタスクを管理可能なステップに分解し、自律的に実行します。"
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "エージェントワークフロー",
        description: "ワークスペースの状態を管理し、成果物を作成し、環境と対話します。"
    }
];

export const Features: React.FC = () => {
    return (
        <section className="py-24 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.h2
                    className="text-4xl font-bold text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Capabilities
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-2xl bg-gray-800 border border-gray-700 hover:border-antigravity-purple transition-colors group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="mb-4 text-antigravity-purple group-hover:text-antigravity-blue transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
