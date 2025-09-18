import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores(['projects/**/*']),
    {
        extends: compat.extends(
            'eslint:recommended',
            'plugin:@typescript-eslint/eslint-recommended',
            'plugin:@typescript-eslint/recommended',
        ),

        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 13,
            sourceType: 'module',

            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },

        settings: {
            'import/resolver': 'webpack',
        },

        rules: {
            semi: ['warn', 'always'],
            quotes: ['warn', 'single'],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
        },
    },
    {
        files: ['**/*.ts'],
        extends: compat.extends('plugin:prettier/recommended'),

        rules: {
            '@typescript-eslint/ban-ts-comment': [
                'warn',
                {
                    'ts-ignore': true,
                    'ts-expect-error': false,
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        extends: compat.extends('plugin:@angular-eslint/template/recommended'),

        rules: {
            'max-len': [
                'error',
                {
                    code: 140,
                },
            ],
        },
    },
]);
