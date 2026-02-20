/*
Erklärung:
root: true → ESLint stoppt hier, keine übergeordneten Konfigurationen werden geladen.
parser: '@typescript-eslint/parser' → für TypeScript-Dateien.
extends → Basisregeln + TypeScript + React.
plugins → TypeScript + React.
settings.react.version = 'detect' → erkennt automatisch deine React-Version.
overrides → separate Regeln für .ts/.tsx und .js/.jsx.
linterOptions.reportUnusedDisableDirectives → ersetzt die alte reportUnusedDisableDirectives-Option.
rules → kleine Anpassungen, z. B. react/react-in-jsx-scope bei React 17+ deaktiviert.
*/
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  plugins: ["@typescript-eslint", "react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
    {
      files: ["*.js", "*.jsx"],
      rules: {
        "no-unused-vars": "warn",
      },
    },
  ],
  rules: {
    "react/react-in-jsx-scope": "off", // nicht nötig bei React 17+
  },
  // linterOptions: {
  //   reportUnusedDisableDirectives: "warn",
  // },
};
