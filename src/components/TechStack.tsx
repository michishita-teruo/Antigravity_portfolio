import { motion } from 'framer-motion';

const techs = [
    "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"
];

export const TechStack: React.FC = () => {
    return (
        <section className="py-12 border-t border-gray-800 bg-black">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-gray-500 mb-6 text-sm uppercase tracking-wider">最新のテクノロジーで構築</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {techs.map((tech, index) => (
                        <motion.span
                            key={index}
                            className="text-xl md:text-2xl font-semibold text-gray-400 hover:text-white transition-colors cursor-default"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>

                <div className="mt-12">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-sm">
                        Powered by Google Gemini 1.5 Pro
                    </span>
                </div>
            </div>
        </section>
    );
};
