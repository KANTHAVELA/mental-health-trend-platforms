import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, User, FilePlus, Mail, Phone, MapPin, Droplet, AlertTriangle, FileText } from 'lucide-react';
import InsightCards from '../components/InsightCards';
import TrendWave from '../components/TrendWave';
import KeywordCloud from '../components/KeywordCloud';
import MoodPieChart from '../components/MoodPieChart';
import StateFlowChart from '../components/StateFlowChart';
import { Skeleton } from '../components/Skeleton';
import useAuthStore from '../store/useAuthStore';
import ManualEntryModal from '../components/ManualEntryModal';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const token = useAuthStore(state => state.user?.token);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Fetch patient details
                const patientRes = await axios.get(`/api/users/${id}/details`, config);
                setPatient(patientRes.data);

                // Fetch analytics data
                const analyticsRes = await axios.get(`/api/analytics/overview?userId=${id}`, config);
                setData(analyticsRes.data);
            } catch (err) {
                console.error("Failed to fetch patient data:", err);
                toast.error("Failed to load patient data.");
            } finally {
                setLoading(false);
            }
        };

        if (token && id) fetchData();
    }, [token, id]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/patients')}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <User size={24} className="text-primary" />
                            Patient Dashboard
                        </h2>
                        <p className="text-muted-foreground text-sm">Viewing analytics for Patient ID: {id}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEntryModalOpen(true)}
                    className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 px-4 shadow-sm"
                >
                    <FilePlus size={20} />
                    <span>Add Record</span>
                </button>
            </div>

            <ManualEntryModal
                isOpen={isEntryModalOpen}
                onClose={() => setIsEntryModalOpen(false)}
                userId={id}
                onEntryAdded={() => {
                    // Trigger refetch by temporarily setting loading to true or using a refetch flag
                    // simple way: 
                    window.location.reload();
                }}
            />

            {/* Patient Information Card */}
            {patient && (
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
                    <div className="flex items-start gap-6">
                        {/* Profile Image */}
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-border flex-shrink-0">
                            {patient.profileImage ? (
                                <img src={patient.profileImage} alt={patient.username} className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-primary" />
                            )}
                        </div>

                        {/* Patient Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">{patient.username}</h3>
                                {patient.patientId && (
                                    <p className="text-sm text-muted-foreground mb-3 font-mono bg-primary/10 text-primary px-2 py-1 rounded inline-block">
                                        {patient.patientId}
                                    </p>
                                )}
                                <div className="space-y-2 mt-3">
                                    {patient.age && patient.dateOfBirth && (
                                        <p className="text-sm text-foreground">
                                            <span className="font-medium">Age:</span> {patient.age} years
                                            <span className="text-muted-foreground ml-2">({new Date(patient.dateOfBirth).toLocaleDateString()})</span>
                                        </p>
                                    )}
                                    {patient.sex && (
                                        <p className="text-sm text-foreground"><span className="font-medium">Sex:</span> {patient.sex}</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Contact</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail size={16} className="text-muted-foreground" />
                                        <span className="text-foreground">{patient.email}</span>
                                    </div>
                                    {patient.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone size={16} className="text-muted-foreground" />
                                            <span className="text-foreground">{patient.phone}</span>
                                        </div>
                                    )}
                                    {(patient.address?.street || patient.address?.city) && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin size={16} className="text-muted-foreground mt-0.5" />
                                            <span className="text-foreground">
                                                {[patient.address.street, patient.address.city, patient.address.state, patient.address.zipCode]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Medical Info */}
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Medical</h4>
                                <div className="space-y-2">
                                    {patient.bloodType && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Droplet size={16} className="text-red-500" />
                                            <span className="text-foreground"><span className="font-medium">Blood:</span> {patient.bloodType}</span>
                                        </div>
                                    )}
                                    {patient.allergies && patient.allergies.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-foreground">Allergies:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {patient.allergies.map((allergy, idx) => (
                                                        <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                            {allergy}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <FileText size={16} className="text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-foreground">Conditions:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {patient.medicalHistory.map((condition, idx) => (
                                                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                            {condition}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!data || (!data.insights && !data.trends) ? (
                <div className="p-8 text-center bg-card border border-border rounded-3xl shadow-sm">
                    <p className="text-muted-foreground">No data available for this patient.</p>
                </div>
            ) : (
                <>
                    <InsightCards data={data?.insights} />

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <TrendWave data={data?.trends} />
                        </div>
                        <div>
                            <MoodPieChart data={data?.categoryDistribution} />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <StateFlowChart />
                        </div>
                        <div>
                            <KeywordCloud data={data?.trends} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientDetail;
