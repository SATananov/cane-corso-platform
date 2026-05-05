import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@cane-corso-platform/ui';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [tailwindPreset as Config],
  theme: {
    extend: {},
  },
};

export default config;
