const autoprefixer = require("autoprefixer");
const tailwindcss = require("@tailwindcss/postcss");

/** @type {import("postcss-load-config").Config} */
const config = {
  plugins: [
    tailwindcss(),
    autoprefixer
  ]
};

module.exports = config;
