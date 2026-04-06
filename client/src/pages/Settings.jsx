import { useState } from 'react';
import { toast } from 'sonner';
import {
    User, Lock, Bell, Palette, Database, Shield,
    Mail, Phone, MapPin, Camera, Save, Eye, EyeOff
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

const Settings = () => {
    const user = useAuthStore(state => state.user);
    const { theme, colorScheme, fontSize, setTheme, setColorScheme, setFontSize } = useThemeStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile Settings State
    const [profileData, setProfileData] = useState({
        fullName: user?.username || '',
        email: user?.email || '',
        phone: '',
        address: '',
        bio: '',
        profileImage: null
    });

    // Security Settings State
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { updateProfile, changePassword, updateSettings } = useAuthStore();

    // Initialize state from user object if available
    // We use a useEffect or simple default value. Default value is better for initial render.
    // However, if user updates, we might want to reflect that. 
    // Given the structure, simple defaults work if user is loaded.

    // Notification Settings State - initialize from user.settings if available
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: user?.settings?.notifications?.email ?? true,
        pushNotifications: user?.settings?.notifications?.push ?? true,
        weeklyReports: user?.settings?.notifications?.weeklyReports ?? true,
        patientAlerts: user?.settings?.notifications?.patientAlerts ?? true,
        systemUpdates: user?.settings?.notifications?.systemUpdates ?? false
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                fullName: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
                address: profileData.address,
                bio: profileData.bio,
                // profileImage would need file upload logic, for now sending null or existing string
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (securityData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await changePassword(securityData.currentPassword, securityData.newPassword);
            toast.success('Password changed successfully!');
            setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setLoading(true);
        try {
            await updateSettings({ notifications: notificationSettings });
            toast.success('Notification preferences updated!');
        } catch (error) {
            toast.error('Failed to update notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleAppearanceUpdate = async () => {
        setLoading(true);
        try {
            // We also update the backend with appearance settings
            await updateSettings({
                appearance: { theme, colorScheme, fontSize }
            });
            toast.success('Appearance settings saved!');
        } catch (error) {
            toast.error('Failed to save appearance settings');
        } finally {
            setLoading(false);
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        toast.success(`Theme changed to ${newTheme}`);
    };

    const handleColorSchemeChange = (newColorScheme) => {
        setColorScheme(newColorScheme);
        toast.success(`Color scheme changed to ${newColorScheme}`);
    };

    const handleFontSizeChange = (newFontSize) => {
        setFontSize(newFontSize);
        toast.success(`Font size changed to ${newFontSize}`);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'privacy', label: 'Privacy & Data', icon: Shield }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6">Profile Information</h3>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {/* Profile Image */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                                                {profileData.profileImage ? (
                                                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={40} className="text-muted-foreground" />
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                                <Camera size={16} />
                                                <input type="file" accept="image/*" className="hidden" />
                                            </label>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Profile Photo</h4>
                                            <p className="text-sm text-muted-foreground">Upload a new profile picture</p>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Dr. John Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="doctor@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                            <textarea
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                                rows="3"
                                                placeholder="123 Medical Center, Mumbai, Maharashtra"
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                            rows="4"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6">Security Settings</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-6">
                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={securityData.currentPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={securityData.newPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={securityData.confirmPassword}
                                                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Shield size={18} />
                                        {loading ? 'Updating...' : 'Change Password'}
                                    </button>
                                </form>

                                {/* Two-Factor Authentication */}
                                <div className="mt-8 pt-8 border-t border-border">
                                    <h4 className="font-semibold text-foreground mb-4">Two-Factor Authentication</h4>
                                    <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                                        <div>
                                            <p className="font-medium text-foreground">Enable 2FA</p>
                                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                        </div>
                                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                            Enable
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly summary of patient analytics' },
                                        { key: 'patientAlerts', label: 'Patient Alerts', desc: 'Urgent alerts for high-risk patients' },
                                        { key: 'systemUpdates', label: 'System Updates', desc: 'Updates about new features and changes' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                                            <div>
                                                <p className="font-medium text-foreground">{item.label}</p>
                                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[item.key]}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleNotificationUpdate}
                                    disabled={loading}
                                    className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Preferences'}
                                </button>
                            </div>
                        )}

                        {/* Appearance Settings */}
                        {activeTab === 'appearance' && (
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6">Appearance Settings</h3>
                                <div className="space-y-6">
                                    {/* Theme */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['light', 'dark', 'auto'].map((themeOption) => (
                                                <button
                                                    key={themeOption}
                                                    type="button"
                                                    onClick={() => handleThemeChange(themeOption)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${theme === themeOption
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <p className="font-medium text-foreground capitalize">{themeOption}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Scheme */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-3">Color Scheme</label>
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { name: 'blue', color: 'bg-blue-500' },
                                                { name: 'purple', color: 'bg-purple-500' },
                                                { name: 'green', color: 'bg-green-500' },
                                                { name: 'orange', color: 'bg-orange-500' }
                                            ].map((scheme) => (
                                                <button
                                                    key={scheme.name}
                                                    type="button"
                                                    onClick={() => handleColorSchemeChange(scheme.name)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${colorScheme === scheme.name
                                                        ? 'border-primary'
                                                        : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 ${scheme.color} rounded-full mx-auto mb-2`}></div>
                                                    <p className="text-sm font-medium text-foreground capitalize">{scheme.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-3">Font Size</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['small', 'medium', 'large'].map((sizeOption) => (
                                                <button
                                                    key={sizeOption}
                                                    type="button"
                                                    onClick={() => handleFontSizeChange(sizeOption)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${fontSize === sizeOption
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <p className="font-medium text-foreground capitalize">{sizeOption}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAppearanceUpdate}
                                    disabled={loading}
                                    className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Appearance'}
                                </button>
                            </div>
                        )}

                        {/* Privacy & Data Settings */}
                        {activeTab === 'privacy' && (
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6">Privacy & Data Management</h3>
                                <div className="space-y-6">
                                    {/* Data Export */}
                                    <div className="p-4 bg-muted rounded-xl">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-foreground mb-1">Export Your Data</h4>
                                                <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
                                            </div>
                                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                                                <Database size={16} />
                                                Export
                                            </button>
                                        </div>
                                    </div>

                                    {/* Data Retention */}
                                    <div className="p-4 bg-muted rounded-xl">
                                        <h4 className="font-semibold text-foreground mb-3">Data Retention</h4>
                                        <select className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none">
                                            <option>Keep data for 1 year</option>
                                            <option>Keep data for 2 years</option>
                                            <option>Keep data for 5 years</option>
                                            <option>Keep data indefinitely</option>
                                        </select>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <h4 className="font-semibold text-red-500 mb-1">Delete Account</h4>
                                        <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data</p>
                                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
