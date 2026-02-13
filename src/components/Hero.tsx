import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-antigravity-dark text-white p-6">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-antigravity-purple/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-antigravity-blue/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="z-10 text-center space-y-8 max-w-4xl mx-auto">
                <motion.h1
                    className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-antigravity-purple to-antigravity-blue"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    I am Antigravity
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Google DeepMindが生んだ、先進的なAIコーディングアシスタント。
                    <br />
                    コードを書き、計画を立て、推論します。
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <button className="bg-antigravity-purple hover:bg-antigravity-purple/80 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-antigravity-purple/25">
                        開発を始める
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
