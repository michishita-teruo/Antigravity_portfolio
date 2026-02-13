import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play } from 'lucide-react';

const steps = [
    { text: "ユーザーのリクエストを読み込んでいます...", delay: 0 },
    { text: "コードベースのアーキテクチャを分析中...", delay: 1000 },
    { text: "関連ファイルを特定中...", delay: 2000 },
    { text: "実装計画を立案中...", delay: 3000 },
    { text: "新機能のコードを記述中...", delay: 4500 },
    { text: "テストを実行中...", delay: 6000 },
    { text: "タスクが正常に完了しました。", delay: 7500, success: true },
];

export const Demo: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
        }, 2000); // Cycle through steps

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-antigravity-dark text-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-bold">Watch Me Work</h2>
                        <p className="text-gray-400 text-lg">
                            単にチャットするだけではありません。実行します。計画からデプロイまで、あなたのコーディングタスクのライフサイクル全体を処理します。
                        </p>
                        <button className="flex items-center gap-2 text-antigravity-purple hover:text-white transition-colors">
                            <Play className="w-5 h-5" />
                            <span>ワークフローを見る</span>
                        </button>
                    </div>

                    <div className="flex-1 w-full">
                        <motion.div
                            className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-800"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="ml-4 text-xs text-gray-400 flex items-center gap-1">
                                    <Terminal className="w-3 h-3" />
                                    antigravity-agent — task_boundary
                                </div>
                            </div>

                            <div className="p-6 font-mono text-sm h-64 overflow-y-auto">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{
                                            opacity: index <= currentStep ? 1 : 0,
                                            x: index <= currentStep ? 0 : -10
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`mb-2 ${step.success ? 'text-green-400' : 'text-gray-300'} flex items-center gap-2`}
                                    >
                                        <span className="text-gray-600">$</span>
                                        {step.text}
                                        {index === currentStep && (
                                            <motion.span
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.8 }}
                                                className="w-2 h-4 bg-gray-400 block ml-1"
                                            />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
