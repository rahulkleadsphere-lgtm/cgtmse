/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          app: "#0D0D0D",
          sidebar: "#090909",
          composer: "#212121",
          hover: "#292929",
          border: "#303030",
          text: "#ECECEC",
          muted: "#9B9B9B",
          subtle: "#737373",
        },
        cgtmse: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          "blue-subtle": "rgba(37, 99, 235, 0.12)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        chat: "800px",
      },
      borderRadius: {
        'chat': "14px",
      }
    },
  },
  plugins: [],
}
