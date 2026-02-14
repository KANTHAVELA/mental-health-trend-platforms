import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            // Set default auth header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            set({ user, isLoading: false });
            return user;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Login failed'
            });
            throw error;
        }
    },

    register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('/api/auth/register', { username, email, password });
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            // Set default auth header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            set({ user, isLoading: false });
            return user;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Registration failed'
            });
            throw error;
        }
    },

    updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put('/api/users/profile', userData);
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, isLoading: false });
            return user;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Profile update failed'
            });
            throw error;
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
            await axios.put('/api/users/password', { currentPassword, newPassword });
            set({ isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Password change failed'
            });
            throw error;
        }
    },

    updateSettings: async (settingsData) => {
        try {
            const response = await axios.put('/api/users/settings', settingsData);
            const updatedSettings = response.data;

            // Update local user object deeply
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    settings: {
                        ...currentUser.settings,
                        ...updatedSettings // This might need deep merge if structure is complex, but for now flat merge of top keys
                    }
                };

                // If the response is the full settings object, we can just assign it
                // The backend returns user.settings
                updatedUser.settings = updatedSettings;

                localStorage.setItem('user', JSON.stringify(updatedUser));
                set({ user: updatedUser });
            }
        } catch (error) {
            console.error('Failed to update settings', error);
            throw error; // Re-throw to handle in component
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null });
    },
}));

// Initialize axios header if user exists on load
const user = JSON.parse(localStorage.getItem('user'));
if (user?.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
}

export default useAuthStore;
