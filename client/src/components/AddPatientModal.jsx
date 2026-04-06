import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { X, UserPlus, Loader2, Upload, ChevronRight, ChevronLeft, User, Phone, Heart } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AddPatientModal = ({ isOpen, onClose, onUserAdded }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Basic info
        username: '',
        email: '',
        dateOfBirth: '',
        sex: '',
        profileImage: '',

        // Contact info
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',

        // Medical & Mental Health info
        bloodType: '',
        allergies: '',
        medicalHistory: '',
        currentMentalHealthStatus: '',
        previousMentalHealthDiagnoses: '',
        currentMedications: '',
        therapyHistory: '',
        suicidalThoughts: '',
        password: 'password123'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = useAuthStore(state => state.user?.token);

    if (!isOpen) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData({ ...formData, profileImage: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleNext = () => {
        // Validation for each step
        if (currentStep === 1) {
            if (!formData.username || !formData.email) {
                toast.error('Please fill in name and email');
                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If not on the last step, just go next (happens if user presses Enter)
        if (currentStep < 3) {
            handleNext();
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Prepare data
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth || undefined,
                sex: formData.sex || undefined,
                phone: formData.phone || undefined,
                address: {
                    street: formData.street || '',
                    city: formData.city || '',
                    state: formData.state || '',
                    zipCode: formData.zipCode || ''
                },
                bloodType: formData.bloodType || undefined,
                allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
                medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(m => m.trim()) : [],
                profileImage: formData.profileImage || undefined,
                // Mental health fields
                mentalHealth: {
                    currentStatus: formData.currentMentalHealthStatus || undefined,
                    previousDiagnoses: formData.previousMentalHealthDiagnoses ? formData.previousMentalHealthDiagnoses.split(',').map(d => d.trim()) : [],
                    currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map(m => m.trim()) : [],
                    therapyHistory: formData.therapyHistory || undefined,
                    riskAssessment: formData.suicidalThoughts || undefined
                }
            };

            const res = await axios.post('/api/users/create', payload, config);
            toast.success(`Patient ${res.data.username} added successfully!`, {
                description: `Patient ID: ${res.data.patientId}`
            });
            onUserAdded(res.data);
            onClose();

            // Reset form
            setFormData({
                username: '', email: '', dateOfBirth: '', sex: '', profileImage: '',
                phone: '', street: '', city: '', state: '', zipCode: '',
                bloodType: '', allergies: '', medicalHistory: '',
                currentMentalHealthStatus: '', previousMentalHealthDiagnoses: '',
                currentMedications: '', therapyHistory: '', suicidalThoughts: '',
                password: 'password123'
            });
            setImagePreview(null);
            setCurrentStep(1);
        } catch (err) {
            console.error('Full error:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to add patient';
            toast.error(errorMessage, {
                description: err.response?.data?.error || 'Please check the console for details'
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-muted-foreground" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <Upload size={16} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Upload patient photo (optional)</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Rajesh Kumar"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="rajesh@example.com"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Date of Birth</label>
                    <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Sex</label>
                    <select
                        value={formData.sex}
                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="+91 98765 43210"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Street Address</label>
                <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="123 MG Road"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">City</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Mumbai"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">State</label>
                    <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Maharashtra"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">ZIP Code</label>
                <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="400001"
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Blood Type</label>
                <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Allergies</label>
                <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Penicillin, Peanuts (comma-separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate multiple allergies with commas</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">General Medical History</label>
                <textarea
                    rows="2"
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Type 2 Diabetes, Hypertension (comma-separated)"
                ></textarea>
                <p className="text-xs text-muted-foreground mt-1">List existing medical conditions</p>
            </div>

            {/* Mental Health Section */}
            <div className="border-t border-border pt-4 mt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-primary" />
                    Mental Health Assessment
                </h4>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Current Mental Health Status</label>
                        <select
                            value={formData.currentMentalHealthStatus}
                            onChange={(e) => setFormData({ ...formData, currentMentalHealthStatus: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="">Select current status</option>
                            <option value="Stable">Stable</option>
                            <option value="Mild Symptoms">Mild Symptoms</option>
                            <option value="Moderate Symptoms">Moderate Symptoms</option>
                            <option value="Severe Symptoms">Severe Symptoms</option>
                            <option value="In Crisis">In Crisis</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Previous Mental Health Diagnoses</label>
                        <input
                            type="text"
                            value={formData.previousMentalHealthDiagnoses}
                            onChange={(e) => setFormData({ ...formData, previousMentalHealthDiagnoses: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Depression, Anxiety, PTSD (comma-separated)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">List any previous mental health diagnoses</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Current Medications</label>
                        <input
                            type="text"
                            value={formData.currentMedications}
                            onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Sertraline 50mg, Alprazolam 0.5mg (comma-separated)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">List current psychiatric medications</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Therapy/Counseling History</label>
                        <select
                            value={formData.therapyHistory}
                            onChange={(e) => setFormData({ ...formData, therapyHistory: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="">Select therapy history</option>
                            <option value="Never">Never attended therapy</option>
                            <option value="Past">Past therapy (not current)</option>
                            <option value="Current">Currently in therapy</option>
                            <option value="Hospitalized">Previous psychiatric hospitalization</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Risk Assessment</label>
                        <select
                            value={formData.suicidalThoughts}
                            onChange={(e) => setFormData({ ...formData, suicidalThoughts: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="">Select risk level</option>
                            <option value="No">No current thoughts of self-harm</option>
                            <option value="Passive">Passive thoughts (no plan)</option>
                            <option value="Active">Active thoughts (with plan)</option>
                            <option value="Recent Attempt">Recent suicide attempt</option>
                        </select>
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">⚠️ This information helps provide appropriate care</p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Temporary Password</label>
                <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                />
            </div>
        </div>
    );

    const stepIcons = [
        { icon: User, label: 'Basic Info' },
        { icon: Phone, label: 'Contact' },
        { icon: Heart, label: 'Medical' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <UserPlus className="text-primary" size={24} />
                        Add New Patient
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                    {stepIcons.map((step, index) => {
                        const StepIcon = step.icon;
                        const stepNumber = index + 1;
                        const isActive = currentStep === stepNumber;
                        const isCompleted = currentStep > stepNumber;

                        return (
                            <React.Fragment key={stepNumber}>
                                <div 
                                    className="flex flex-col items-center cursor-pointer"
                                    onClick={() => {
                                        // Allow jumping back or if validation passes
                                        if (stepNumber < currentStep || (formData.username && formData.email)) {
                                            setCurrentStep(stepNumber);
                                        } else if (stepNumber > currentStep && (!formData.username || !formData.email)) {
                                            toast.error('Please fill in name and email first');
                                        }
                                    }}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-primary text-primary-foreground' :
                                        isCompleted ? 'bg-primary/20 text-primary' :
                                            'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}>
                                        <StepIcon size={20} />
                                    </div>
                                    <p className={`text-xs mt-2 ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                        {step.label}
                                    </p>
                                </div>
                                {stepNumber < 3 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={currentStep === 1 ? onClose : handleBack}
                            className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                        >
                            {currentStep > 1 && <ChevronLeft size={16} />}
                            {currentStep === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading && <Loader2 className="animate-spin" size={16} />}
                                Create Patient
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
