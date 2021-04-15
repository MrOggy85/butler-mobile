module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@react-native-community',
    'plugin:react/all',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
        jsx: true,
    },
  },
  env: {
    'react-native/react-native': true,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
  ],
  rules: {
    // Disabled Prettier
    'prettier/prettier': 0,

    // General
    'no-empty-pattern': 1,

    // React
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [1, 2],
    'react/jsx-filename-extension': [2, { 'extensions': ['.tsx'] }],
    'react/jsx-max-depth': 0,
    'react/jsx-max-props-per-line': 1,
    'react/jsx-props-no-multi-spaces': 1,
    'react/jsx-no-literals': 0,
    'react/jsx-sort-props': [2, { noSortAlphabetically: true }],
    'react/jsx-no-bind': 0,
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-curly-newline': 1,
    'react/jsx-one-expression-per-line': 0,
    'react/forbid-component-props': [2, { forbid: [] }],
    'react/no-multi-comp': 0,
    'react/no-array-index-key': 1,
    'react/require-default-props': 0,
    'react/prop-types': 0,



    // React Native
    'react-native/sort-styles': 0,
    'react-native/no-color-literals': 0,

    // TypeScript
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-empty-function': 1,
  },
};
