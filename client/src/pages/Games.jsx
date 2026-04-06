import { useState, useEffect, useRef } from 'react';
import { Sparkles, Wind, Brain, Eraser, RotateCcw, Play } from 'lucide-react';
import { clsx } from 'clsx';

const MEMORY_ICONS = [Brain, Sparkles, Wind, RotateCcw, Play, Eraser];

const BreathingBubble = () => {
    const [phase, setPhase] = useState('Inhale');
    const [timer, setTimer] = useState(4);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((previous) => {
                if (previous > 1) {
                    return previous - 1;
                }

                if (phase === 'Inhale') {
                    setPhase('Hold');
                    return 4;
                }

                if (phase === 'Hold') {
                    setPhase('Exhale');
                    return 4;
                }

                setPhase('Inhale');
                return 4;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
                <Wind className="w-5 h-5" />
                Breathing Space
            </h3>

            <div className="relative flex items-center justify-center w-64 h-64">
                <div className={clsx('absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out', phase === 'Inhale' ? 'bg-indigo-200/50 scale-110' : phase === 'Exhale' ? 'bg-indigo-100/30 scale-75' : 'bg-indigo-200/40 scale-110')} />

                <div className={clsx('w-48 h-48 rounded-full flex items-center justify-center transition-all duration-[4000ms] ease-in-out bg-gradient-to-br from-indigo-500 to-purple-500 shadow-2xl z-10', phase === 'Inhale' ? 'scale-100 shadow-indigo-500/50' : phase === 'Exhale' ? 'scale-50 shadow-indigo-300/30' : 'scale-100 shadow-indigo-400/40')}>
                    <span className="text-white font-bold text-2xl drop-shadow-md">{phase}</span>
                </div>
            </div>

            <div className="mt-8 text-indigo-600 font-medium">{timer} seconds remaining</div>
        </div>
    );
};

const createShuffledCards = () => {
    const duplicatedIcons = [...MEMORY_ICONS, ...MEMORY_ICONS];
    return duplicatedIcons
        .map((Icon, index) => ({ id: index, Icon, value: index % MEMORY_ICONS.length }))
        .sort(() => Math.random() - 0.5);
};

const MemoryMatch = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setCards(createShuffledCards());
    }, []);

    const handleCardClick = (index) => {
        if (disabled || flipped.includes(index) || solved.includes(index)) {
            return;
        }

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [first, second] = newFlipped;

            if (cards[first].value === cards[second].value) {
                setSolved([...solved, first, second]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    const resetGame = () => {
        setCards(createShuffledCards());
        setSolved([]);
        setFlipped([]);
        setDisabled(false);
    };

    return (
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
                    <Brain className="w-5 h-5" />
                    Cognitive Focus
                </h3>
                <button onClick={resetGame} className="p-2 hover:bg-purple-100 rounded-full transition-colors text-purple-600">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || solved.includes(index);
                    const Icon = card.Icon;

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            className={clsx('w-16 h-16 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 transform preserve-3d', isFlipped ? 'bg-purple-500 text-white rotate-y-180' : 'bg-purple-100 text-purple-400 hover:bg-purple-200')}
                        >
                            {isFlipped ? <Icon className="w-8 h-8 rotate-y-180" /> : <div className="w-4 h-4 rounded-full bg-purple-300" />}
                        </div>
                    );
                })}
            </div>

            {solved.length === cards.length && cards.length > 0 && (
                <div className="mt-4 text-center text-green-600 font-bold animate-bounce">
                    Well Done!
                </div>
            )}
        </div>
    );
};

const ZenCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#6366f1');

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.lineWidth = 3;
    }, []);

    const startDrawing = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (event) => {
        if (!isDrawing) {
            return;
        }

        const { offsetX, offsetY } = event.nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="p-8 bg-white/50 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
                    <Sparkles className="w-5 h-5" />
                    Zen Canvas
                </h3>
                <div className="flex gap-3">
                    <div className="flex gap-2 bg-indigo-100/50 p-1.5 rounded-full px-3">
                        {['#6366f1', '#ec4899', '#10b981', '#f59e0b'].map((paletteColor) => (
                            <button
                                key={paletteColor}
                                onClick={() => setColor(paletteColor)}
                                className={clsx('w-5 h-5 rounded-full transition-transform hover:scale-125', color === paletteColor && 'ring-2 ring-offset-2 ring-indigo-400 scale-110')}
                                style={{ backgroundColor: paletteColor }}
                            />
                        ))}
                    </div>
                    <button onClick={clearCanvas} className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-600" title="Clear Canvas">
                        <Eraser className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-indigo-100 cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full block"
                />
            </div>
            <p className="mt-4 text-sm text-indigo-400/80 text-center italic">
                Let your mind flow through your fingertips. No mistakes, only happy accidents.
            </p>
        </div>
    );
};

const Games = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                    Mindful Hub
                </h1>
                <p className="text-muted-foreground text-lg">
                    Take a moment for yourself. Choose an activity to relax and refocus.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <BreathingBubble />
                <MemoryMatch />
                <ZenCanvas />
            </div>
        </div>
    );
};

export default Games;
