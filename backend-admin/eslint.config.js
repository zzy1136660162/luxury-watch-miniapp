import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    ignores: [
      'public',
      'dist*',
    ],
  },
  {
    rules: {
      'e18e/prefer-static-regex': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'curly': ['error', 'all'],
      'ts/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
      }],
      'vue/block-order': 'off',
      'vue/component-tags-order': 'off',
      'style indentation': 'off',
      'prettier/prettier': 'off',
    },
  },
  {
    files: [
      'src/**/*.vue',
    ],
    rules: {
      'vue/block-order': 'off',
    },
  },
)
