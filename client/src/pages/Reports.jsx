import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FilePlus } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import ManualEntryModal from '../components/ManualEntryModal';

const Reports = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchEntries = async () => {
        try {
            const response = await axios.get('/api/entry');
            setEntries(response.data);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
            toast.error("Failed to load reports.", {
                description: "Could not retrieve entry history."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48 mb-6" />
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Detailed Reports</h2>
                    <p className="text-muted-foreground">Comprehensive activity log for all patients.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground p-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 px-4 shadow-sm"
                >
                    <FilePlus size={20} />
                    <span className="hidden md:inline">Add Report</span>
                </button>
            </header>

            <ManualEntryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={null} // Pass null to enable patient selection
                onEntryAdded={() => {
                    setLoading(true);
                    fetchEntries();
                }}
            />

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/30 text-muted-foreground text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Patient</th>
                                <th className="p-4 font-medium">Date & Time</th>
                                <th className="p-4 font-medium">Mood (1-10)</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium">Keywords</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {entries.map((entry) => (
                                <tr
                                    key={entry._id}
                                    onClick={() => entry.user?._id && navigate(`/patients/${entry.user._id}`)}
                                    className="hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {entry.user?.username || 'Unknown User'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {entry.user?.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-foreground text-sm">
                                        {formatDate(entry.timestamp)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${entry.emotion >= 7 ? 'bg-emerald-100 text-emerald-700' :
                                            entry.emotion >= 4 ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {entry.emotion}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground text-sm">
                                        <span className="px-2 py-1 rounded-md bg-muted border border-border text-xs font-medium">
                                            {entry.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {entry.keywords.map((k, idx) => (
                                                <span key={idx} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {entries.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        No entries found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
