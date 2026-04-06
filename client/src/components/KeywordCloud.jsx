import { useMemo } from 'react';
import { motion } from 'framer-motion';

const Bubble = ({ keyword, count, index }) => {
    // Generate random positions and delays for "floating" effect
    const randomDelay = useMemo(() => Math.random() * 2, []);
    const randomDuration = useMemo(() => 3 + Math.random() * 2, []);
    const size = Math.max(80, Math.min(150, count * 20)); // Dynamic size based on count

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -20, 0],
            }}
            transition={{
                y: {
                    duration: randomDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: randomDelay
                },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, type: "spring" }
            }}
            className="absolute flex items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 backdrop-blur-sm cursor-pointer hover:bg-primary/20 transition-colors"
            style={{
                width: size,
                height: size,
                left: `${(index * 25) % 80}%`, // Rudimentary positioning logic
                top: `${(index * 30) % 70}%`
            }}
        >
            <div className="text-center">
                <span className="block text-foreground font-medium text-sm">{keyword}</span>
                <span className="block text-xs text-muted-foreground">{count} occurrences</span>
            </div>
        </motion.div>
    );
};

const KeywordCloud = ({ data }) => {
    // Flatten keywords from daily data
    const keywords = useMemo(() => {
        if (!data) return [];
        const all = {};
        data.forEach(day => {
            day.topKeywords.forEach(k => {
                all[k.keyword] = (all[k.keyword] || 0) + k.count;
            });
        });
        return Object.entries(all)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 keywords
    }, [data]);

    return (
        <div className="h-[400px] rounded-3xl bg-card border border-border shadow-sm p-6 relative overflow-hidden">
            <h3 className="text-lg font-semibold text-foreground mb-4 relative z-10">Top Stressors & Keywords</h3>
            <div className="absolute inset-0 top-12">
                {keywords.map((k, i) => (
                    <Bubble key={k.keyword} keyword={k.keyword} count={k.count} index={i} />
                ))}
            </div>
        </div>
    );
};

export default KeywordCloud;
