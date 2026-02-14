import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { X, FilePlus, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const ManualEntryModal = ({ isOpen, onClose, userId, onEntryAdded }) => {
    const [formData, setFormData] = useState({
        emotion: 5,
        category: 'General',
        keywords: '',
        notes: '',
        timestamp: new Date().toISOString().slice(0, 16),
        selectedPatientId: ''
    });
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [fetchingPatients, setFetchingPatients] = useState(false);
    const token = useAuthStore(state => state.user?.token);

    // Fetch patients list when userId is not provided
    useEffect(() => {
        if (!userId && isOpen) {
            const fetchPatients = async () => {
                setFetchingPatients(true);
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    const response = await axios.get('/api/users', config);
                    setPatients(response.data);
                } catch (err) {
                    console.error('Failed to fetch patients:', err);
                    toast.error('Failed to load patient list');
                } finally {
                    setFetchingPatients(false);
                }
            };
            fetchPatients();
        }
    }, [userId, isOpen, token]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const payload = {
                userId: userId || formData.selectedPatientId,
                emotion: parseInt(formData.emotion),
                category: formData.category,
                keywords: keywordsArray,
                notes: formData.notes,
                timestamp: new Date(formData.timestamp)
            };

            await axios.post('/api/entry/manual', payload, config);
            toast.success("Clinical record added successfully!");
            onEntryAdded();
            onClose();
            // Reset form
            setFormData({
                emotion: 5,
                category: 'General',
                keywords: '',
                notes: '',
                timestamp: new Date().toISOString().slice(0, 16),
                selectedPatientId: ''
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add record.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <FilePlus className="text-primary" size={24} />
                        Add Clinical Record
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Select Patient Dropdown (Only if userId not provided) */}
                    {!userId && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {formData.selectedPatientId
                                    ? patients.find(p => p._id === formData.selectedPatientId)?.username || 'Select Patient'
                                    : 'Select Patient'}
                            </label>
                            <select
                                required
                                value={formData.selectedPatientId}
                                onChange={(e) => setFormData({ ...formData, selectedPatientId: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                disabled={fetchingPatients}
                            >
                                <option value="">
                                    {fetchingPatients ? 'Loading patients...' : '-- Choose a Patient --'}
                                </option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>{p.username} ({p.email})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.timestamp}
                                onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                            >
                                <option>General</option>
                                <option>Work</option>
                                <option>Social</option>
                                <option>Health</option>
                                <option>Family</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Mood Score (1-10)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.emotion}
                                onChange={(e) => setFormData({ ...formData, emotion: e.target.value })}
                                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xl font-bold text-primary w-8 text-center">{formData.emotion}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">1 = Severe Distress, 10 = Excellent</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Keywords (comma separated)</label>
                        <input
                            type="text"
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="anxiety, sleep, medication"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Clinical Notes</label>
                        <textarea
                            rows="4"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            placeholder="Observations, patient report, next steps..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && <Loader2 className="animate-spin" size={16} />}
                            Save Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualEntryModal;
