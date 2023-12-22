/** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
  plugins: [require("daisyui")],
};

daisyui: {
  themes: [
    {
      mytheme: {
        primary: "#570df8",

        secondary: "#f000b8",

        accent: "#1dcdbc",

        neutral: "#2b3440",

        "base-100": "#ffffff",

        info: "#3abff8",

        success: "#36d399",

        warning: "#fbbd23",

        error: "#f87272",
      },
    },
  ];
}
