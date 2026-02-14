import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // 'light', 'dark', or 'auto'
            colorScheme: 'blue',
            fontSize: 'medium',

            setTheme: (theme) => {
                set({ theme });
                // Apply theme to document
                if (theme === 'auto') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.classList.toggle('dark', prefersDark);
                } else {
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                }
            },

            setColorScheme: (colorScheme) => set({ colorScheme }),

            setFontSize: (fontSize) => set({ fontSize }),

            // Initialize theme on app load
            initializeTheme: () => {
                const state = useThemeStore.getState();
                if (state.theme === 'auto') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.classList.toggle('dark', prefersDark);
                } else {
                    document.documentElement.classList.toggle('dark', state.theme === 'dark');
                }
            }
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
