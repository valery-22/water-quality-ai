import { type Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/shadcn-ui/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
