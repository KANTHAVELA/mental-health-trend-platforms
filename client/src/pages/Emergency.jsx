import { useState, useRef, useEffect } from 'react';
import { Phone, AlertTriangle, Send, User, Bot, PhoneCall, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const Emergency = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to MindFlow Crisis Support. I'm here to listen. How are you feeling right now?", sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getAIResponse = (userInput) => {
        const inputValue = userInput.toLowerCase();
        const responses = {
            CRISIS: [
                "I'm very concerned about what you're sharing. Please know that you're not alone and there is help available right now. I've highlighted the SOS button. Please consider using it or calling a crisis line immediately.",
                "It sounds like you're in a lot of pain. I'm just an AI, but I want you to be safe. Please reach out to the emergency services or use the Call Doctor button above.",
                'Your safety is the most important thing. Please, if you are feeling like you might harm yourself, reach out to a professional immediately. I am here to listen, but I cannot replace a crisis counselor.',
            ],
            ANXIETY: [
                "I hear how overwhelmed you're feeling. Let's try to ground ourselves. Can you tell me three things you can see around you right now?",
                "Anxiety can be so heavy. Remember to take slow, deep breaths. In for four, hold for four, out for four. Would you like to try that with me?",
                "It's okay to feel this way. Take a moment to step back. Is there something specific that's triggering this feeling, or does it feel more general?",
            ],
            SLEEP: [
                'Lack of sleep can really impact your mood. Have you tried a digital detox an hour before bed? Turning off screens can sometimes help.',
                "I'm sorry you're struggling to rest. Sometimes progressive muscle relaxation can help by tensing and then releasing each muscle group. Want to hear more?",
                "Sleep issues are very common when we're stressed. Try not to pressure yourself to fall asleep. Sometimes just resting quietly is enough for now.",
            ],
            APP_HELP: [
                'You can view your long-term progress in the Dashboard section. It shows your mood trends over the last 30 days.',
                "To add a new mood entry, go to the Reports page and click Add Report, or use the Add Record button on a patient's page.",
                'MindFlow helps you track your emotional health by connecting your daily feelings with specific activities and categories.',
            ],
            GREETING: [
                "Hello! I'm here to support you. How has your day been so far?",
                "Hi there. I'm your MindFlow assistant. What's on your mind today?",
                'Greetings. I am here whenever you need a safe space to talk.',
            ],
            GENERAL: [
                "I'm listening. Tell me more about that.",
                'I see. How does that make you feel?',
                'That sounds significant. Thank you for sharing that with me.',
                "I'm here for you. Is there anything else you'd like to get off your chest?",
            ],
        };

        if (inputValue.includes('kill') || inputValue.includes('suicide') || inputValue.includes('harm') || inputValue.includes('end it') || inputValue.includes('die')) {
            return responses.CRISIS[Math.floor(Math.random() * responses.CRISIS.length)];
        }
        if (inputValue.includes('anxious') || inputValue.includes('anxiety') || inputValue.includes('panic') || inputValue.includes('scared') || inputValue.includes('worry')) {
            return responses.ANXIETY[Math.floor(Math.random() * responses.ANXIETY.length)];
        }
        if (inputValue.includes('sleep') || inputValue.includes('insomnia') || inputValue.includes('awake') || inputValue.includes('tired')) {
            return responses.SLEEP[Math.floor(Math.random() * responses.SLEEP.length)];
        }
        if (inputValue.includes('how') || inputValue.includes('app') || inputValue.includes('dashboard') || inputValue.includes('feature') || inputValue.includes('use')) {
            return responses.APP_HELP[Math.floor(Math.random() * responses.APP_HELP.length)];
        }
        if (inputValue.includes('hi') || inputValue.includes('hello') || inputValue.includes('hey')) {
            return responses.GREETING[Math.floor(Math.random() * responses.GREETING.length)];
        }

        return responses.GENERAL[Math.floor(Math.random() * responses.GENERAL.length)];
    };

    const handleSend = (event) => {
        event.preventDefault();
        if (!input.trim()) {
            return;
        }

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        const currentInput = input;
        setMessages((previous) => [...previous, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = getAIResponse(currentInput);
            setMessages((previous) => [...previous, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1200);
    };

    const handleSOS = () => {
        toast.error('SOS Alert Sent', {
            description: 'Your primary emergency contacts and doctor have been notified of your location and status.',
            duration: 5000,
        });
    };

    const handleCallDoctor = () => {
        toast.info('Connecting to Doctor...', {
            description: 'Initiating a secure video call with Dr. Arumugam.',
        });
        window.location.href = 'tel:+919876543210';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <ShieldAlert className="text-destructive" size={32} />
                        Emergency Support
                    </h2>
                    <p className="text-muted-foreground">Immediate assistance when you need it most.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSOS} className="bg-destructive text-destructive-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-destructive/20 hover:bg-destructive/90 transition-all active:scale-95">
                        <AlertTriangle size={24} />
                        SOS ALERT
                    </button>
                    <button onClick={handleCallDoctor} className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                        <PhoneCall size={24} />
                        CALL DOCTOR
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col h-[600px] bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Crisis AI Support</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs text-muted-foreground font-medium">Always available</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border text-primary'}`}>
                                        {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted/50 border border-border text-foreground rounded-tl-none'}`}>
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-muted/50 border border-border p-3 px-5 rounded-2xl rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-4 bg-muted/10 border-t border-border flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button type="submit" className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-all">
                            <Send size={20} />
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Phone className="text-primary" size={20} />
                            Quick Contacts
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'National Hotline', number: '1-800-273-8255', desc: 'Available 24/7' },
                                { name: 'Crisis Text Line', number: 'Text HOME to 741741', desc: 'For text-based support' },
                                { name: 'MindFlow Helpdesk', number: '044-2456-7890', desc: 'App & clinical support' },
                            ].map((contact) => (
                                <div key={contact.name} className="p-4 rounded-2xl bg-muted/30 border border-border hover:border-primary/30 transition-all cursor-pointer group">
                                    <p className="font-semibold group-hover:text-primary transition-colors">{contact.name}</p>
                                    <p className="text-primary font-mono text-sm">{contact.number}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{contact.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
                        <h3 className="font-bold text-lg text-primary mb-3">Self-Help Guidance</h3>
                        <ul className="space-y-3">
                            {[
                                'Take 5 deep abdominal breaths.',
                                'Name 5 things you can see right now.',
                                'Drink a glass of cold water.',
                                'Remind yourself: This feeling is temporary.',
                            ].map((tip, index) => (
                                <li key={tip} className="flex gap-3 text-sm text-foreground/80">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                        {index + 1}
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emergency;
