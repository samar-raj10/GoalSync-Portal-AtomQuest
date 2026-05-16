const path = require('path');

// Point Tailwind directly at the client config so Vite finds content paths
// correctly even when commands are launched from the repository root.
module.exports = {
  plugins: {
    tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
    autoprefixer: {}
  }
};
