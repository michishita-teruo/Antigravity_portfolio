import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Database, Globe, PenTool as Tool, Layers } from 'lucide-react';

const SkillCard = ({ icon: Icon, title, description, tags, color }: { icon: any, title: string, description: string, tags: string[], color: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
    >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {description}
        </p>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-500">
                    {tag}
                </span>
            ))}
        </div>
    </motion.div>
);

export const Skills: React.FC = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden" id="skills">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-5xl font-black mb-6 leading-tight">
                            The Evolution of<br />
                            <span className="text-antigravity-purple">Agentic Skills</span>
                        </h2>
                        <p className="text-xl text-gray-400 leading-relaxed mb-8">
                            Antigravity は単なる AI ではありません。プロジェクトごとに必要な専門知識を「スキル」として動的にロードし、自らを拡張します。
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: '知識の物理化', desc: '手順やベストプラクティスをコード（SKILL.md）として保持' },
                                { title: '状況適応型知能', desc: 'タスクに合わせて最適なスキルセットをスキャンし、即座に専門家化' },
                                { title: '永続的な学習', desc: '解決した課題は新たなスキルとしてアーカイブされ、次の進化へと繋がる' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-antigravity-purple/20 flex items-center justify-center mt-1">
                                        <Zap size={14} className="text-antigravity-purple" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white tracking-wide">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SkillCard
                            icon={Globe}
                            title="Nostalgic Reconstruction"
                            description="90年代のWebデザインを現代の React 環境で忠実に再現。MS Pゴシックや点滅演出の専門知識を網羅。"
                            tags={['Aesthetics', 'Legacy', 'Retro']}
                            color="bg-orange-500/20"
                        />
                        <SkillCard
                            icon={Layers}
                            title="CI/CD Automation"
                            description="GitHub Actions を利用した SFTP 自動デプロイとサーバー同期。開発サイクルの極限的な効率化。"
                            tags={['DevOps', 'GitHub Actions', 'SFTP']}
                            color="bg-blue-500/20"
                        />
                        <SkillCard
                            icon={Database}
                            title="Firebase Orchestration"
                            description="Firestore を用いたリアルタイム BBS とセッションベースのアクセスカウンターの自律構築。"
                            tags={['Backend', 'Firebase', 'Live']}
                            color="bg-yellow-500/20"
                        />
                        <SkillCard
                            icon={Tool}
                            title="Secure Interaction"
                            description="ハニーポットや CAPTCHA、Google Forms との連携による、レトロ感を損なわない堅牢な通信。"
                            tags={['Security', 'Forms', 'Bot-Protection']}
                            color="bg-green-500/20"
                        />
                    </div>
                </div>

                {/* Conceptual Diagram */}
                <div className="bg-gradient-to-r from-antigravity-purple/10 to-transparent p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-antigravity-purple/20 rounded-full flex items-center justify-center animate-pulse">
                            <Cpu size={32} className="text-antigravity-purple" />
                        </div>
                        <div>
                            <span className="text-sm text-antigravity-purple font-mono mb-1 block">CORE SYSTEMS</span>
                            <h3 className="text-2xl font-bold italic">Dynamic Brain Expansion</h3>
                        </div>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-antigravity-purple/50 to-transparent hidden md:block" />
                    <div className="text-center md:text-right">
                        <p className="text-gray-500 text-sm mb-2 uppercase tracking-[0.2em]">Current Active Skills</p>
                        <div className="flex gap-3 justify-end">
                            {['RetroUI', 'CloudCI', 'LiveDB', 'Security+'].map(s => (
                                <span key={s} className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono border border-white/10">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
