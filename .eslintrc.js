module.exports = {
    extends: ['next', 'prettier'],
    settings: {
        next: {
            rootDir: ['apps/*/', 'packages/*/']
        }
    },
    rules: {
        'no-html-link-for-pages': 'off',
        semi: 0,
        'react/no-unescaped-entities': 0,
        'react/display-name': 0,
        'jsx-a11y/alt-text': 0,
        'react-hooks/exhaustive-deps': 0,
    }
}
