import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Lock, Unlock, Plus, Trash2, Calendar, Tag, ShieldCheck } from 'lucide-react';

import { Skeleton } from '../components/Skeleton';

const DEMO_VAULT_KEY = 'owner123';

const PersonalVault = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [vaultKey, setVaultKey] = useState('');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', category: 'General' });
    const [isAdding, setIsAdding] = useState(false);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/personal/notes');
            setNotes(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load your private notes.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = (event) => {
        event.preventDefault();
        if (vaultKey === DEMO_VAULT_KEY) {
            setIsUnlocked(true);
            toast.success('Vault Unlocked', {
                description: 'Welcome to your private space.',
            });
            fetchNotes();
        } else {
            toast.error('Invalid Vault Key', {
                description: 'Please check your secondary password.',
            });
        }
    };

    const handleAddNote = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/personal/notes', newNote);
            setNotes([response.data, ...notes]);
            setNewNote({ title: '', content: '', category: 'General' });
            setIsAdding(false);
            toast.success('Note saved to vault.');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save note.');
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this private note?')) {
            return;
        }

        try {
            await axios.delete(`/api/personal/notes/${id}`);
            setNotes(notes.filter((note) => note._id !== id));
            toast.success('Note removed.');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete note.');
        }
    };

    if (!isUnlocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md p-8 bg-card border border-border rounded-3xl shadow-xl text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Personal Vault</h2>
                    <p className="text-muted-foreground mb-8">This area is password protected for your privacy. Please enter your Vault Key.</p>

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Vault Key..."
                            className="w-full px-5 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-xl tracking-widest"
                            value={vaultKey}
                            onChange={(event) => setVaultKey(event.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                            <Unlock size={20} />
                            Unlock Space
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-muted-foreground italic">
                        Tip: The default key is <span className="font-mono font-bold text-emerald-600">owner123</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <ShieldCheck className="text-emerald-600" size={32} />
                        Personal Space
                    </h2>
                    <p className="text-muted-foreground">Your private notes and thoughts, secured.</p>
                </div>
                <button onClick={() => setIsAdding(!isAdding)} className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-md active:scale-95">
                    <Plus size={20} />
                    New Private Note
                </button>
            </header>

            {isAdding && (
                <div className="bg-card border-2 border-emerald-500/20 rounded-3xl p-6 shadow-inner animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleAddNote} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Note Title"
                            className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground"
                            value={newNote.title}
                            onChange={(event) => setNewNote({ ...newNote, title: event.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Write your private thoughts here..."
                            className="w-full min-h-[150px] bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground resize-none"
                            value={newNote.content}
                            onChange={(event) => setNewNote({ ...newNote, content: event.target.value })}
                            required
                        />
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <select
                                className="bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={newNote.category}
                                onChange={(event) => setNewNote({ ...newNote, category: event.target.value })}
                            >
                                <option>General</option>
                                <option>Strategy</option>
                                <option>Reflection</option>
                                <option>Logistics</option>
                            </select>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md">
                                    Save to Vault
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    Array(3).fill(0).map((_, index) => (
                        <Skeleton key={index} className="h-64 rounded-3xl" />
                    ))
                ) : notes.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-card border border-dashed border-border rounded-3xl">
                        <p className="text-muted-foreground italic">Your vault is empty. Start adding your private notes.</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} className="group bg-card border border-border hover:border-emerald-500/50 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteNote(note._id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                    <Tag size={12} />
                                    {note.category}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3">{note.title}</h3>
                            <p className="text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap">{note.content}</p>

                            <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Secured in Vault</span>
                                <ShieldCheck size={14} className="text-emerald-500/50" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PersonalVault;
