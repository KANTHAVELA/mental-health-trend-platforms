import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, User, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { Skeleton } from '../components/Skeleton';
import useAuthStore from '../store/useAuthStore';
import AddPatientModal from '../components/AddPatientModal';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const token = useAuthStore(state => state.user?.token);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Determine base URL (localhost for dev)
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const res = await axios.get('/api/users', config);
                setPatients(res.data);
            } catch (err) {
                console.error("Error fetching patients:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchPatients();
    }, [token]);

    const filteredPatients = patients.filter(patient =>
        patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div>
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Patient Directory</h2>
                    <p className="text-muted-foreground">Manage and monitor your patients.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-primary-foreground p-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 px-4 shadow-sm"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">Add Patient</span>
                    </button>
                </div>
            </header>

            <AddPatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserAdded={(newUser) => setPatients([newUser, ...patients])}
            />

            <div className="grid gap-4">
                {filteredPatients.map((patient) => (
                    <div
                        key={patient._id}
                        onClick={() => navigate(`/patients/${patient._id}`)}
                        className="bg-card border border-border p-4 rounded-xl flex items-center justify-between cursor-pointer hover:shadow-md transition-all hover:border-primary/30 group"
                    >
                        <div className="flex items-center space-x-4">
                            {/* Profile Image */}
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden border-2 border-border">
                                {patient.profileImage ? (
                                    <img src={patient.profileImage} alt={patient.username} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{patient.username}</h3>
                                    {patient.patientId && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                                            {patient.patientId}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{patient.email}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    {patient.age && (
                                        <span className="text-xs text-muted-foreground">{patient.age} years</span>
                                    )}
                                    {patient.sex && (
                                        <span className="text-xs text-muted-foreground">• {patient.sex}</span>
                                    )}
                                    {(patient.allergies?.length > 0 || patient.medicalHistory?.length > 0) && (
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                            {patient.allergies?.length || 0} allergies • {patient.medicalHistory?.length || 0} conditions
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-muted-foreground">Last Check-in</p>
                                <p className="text-sm font-medium text-foreground">
                                    {patient.lastCheckIn ? new Date(patient.lastCheckIn).toLocaleDateString() : 'Never'}
                                </p>
                            </div>
                            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${patient.status === 'Risk' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                {patient.status === 'Risk' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                                <span>{patient.status || 'Stable'}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredPatients.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No patients found matching &quot;{searchTerm}&quot;
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList;
