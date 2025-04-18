/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                uiLight: "theme(colors.slate.200)",
                uiDark: "#222",
                uiBg: "#DDDDDD",
                uiLightNeutral: "theme(colors.slate.300)",
                accent: "theme(colors.fuchsia.400)"
            },
        },
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        themes: false
    }
};
