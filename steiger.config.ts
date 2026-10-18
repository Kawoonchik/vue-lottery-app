import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['./src/features/auth/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
])
