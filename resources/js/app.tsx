import '../css/app.css';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/error-boundary';
import { initializeTheme } from './hooks/use-appearance';
import Kalender from './pages/admin/kalender';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        if (name.toLowerCase() === 'admin/kalender') {
            return resolvePageComponent('./pages/admin/kalender.tsx', import.meta.glob('./pages/**/*.tsx'));
        }
        return resolvePageComponent(`./pages/${name.toLowerCase()}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});



// This will set light / dark mode on load...
initializeTheme();
