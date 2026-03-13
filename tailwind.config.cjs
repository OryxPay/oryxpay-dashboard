 /** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        },
    });
});
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
        './error.vue',
    ],
    safelist: [
        // Garante que bg-primary seja gerado mesmo em :class dinâmicos (ex.: onboarding wizard)
        'bg-primary',
        '!bg-primary',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                // OryxPay – Primária #24539B
                primary: {
                    DEFAULT: '#24539B',
                    light: '#dbe4f5',
                    'dark-light': 'rgba(36,83,155,.15)',
                    dark: '#24539B',
                },
                // OryxPay – Secundária #6B544B
                secondary: {
                    DEFAULT: '#6B544B',
                    light: '#ede9e6',
                    'dark-light': 'rgba(107,84,75,.15)',
                    dark: '#6B544B',
                },
                success: {
                    DEFAULT: '#22C55E',
                    light: '#dcfce7',
                    'dark-light': 'rgba(34,197,94,.15)',
                },
                danger: {
                    DEFAULT: '#EF4444',
                    light: '#fee2e2',
                    'dark-light': 'rgba(239,68,68,.15)',
                },
                warning: {
                    DEFAULT: '#FACC15',
                    light: '#fef9c3',
                    'dark-light': 'rgba(250,204,21,.15)',
                },
                info: {
                    DEFAULT: '#24539B',
                    light: '#dbe4f5',
                    'dark-light': 'rgba(36,83,155,.15)',
                },
                // Cores Neutras
                dark: {
                    DEFAULT: '#111827', // Cinza Grafite (Texto)
                    light: '#6B7280', // Cinza Médio
                    'dark-light': 'rgba(17,24,39,.15)',
                },
                // Dark Mode Backgrounds
                black: {
                    DEFAULT: '#020617', // Background Principal Dark
                    light: '#0F172A', // Cards / Containers Dark
                    'dark-light': 'rgba(2,6,23,.15)',
                },
                white: {
                    DEFAULT: '#ffffff',
                    light: '#F9FAFB', // Cinza Claro (Background)
                    dark: '#9CA3AF', // Texto Secundário Dark
                },
                // Cores específicas do tema
                gray: {
                    grafite: '#111827', // Cinza Grafite (Texto)
                    medium: '#6B7280', // Cinza Médio
                    light: '#F9FAFB', // Cinza Claro (Background)
                },
            },
            fontFamily: {
                nunito: ['Nunito', 'sans-serif'],
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white.dark'),
                        '--tw-prose-invert-links': theme('colors.white.dark'),
                        h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
                        h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
                        h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
                        h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
                        h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
                        h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
                        p: { marginBottom: '0.5rem' },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        rotateX,
    ],
};
