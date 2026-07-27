module.exports = {
  createOldCatalogs: false, // Prevents creating messy backup files
  lexers: {
    js: ['JsxLexer'], 
    jsx: ['JsxLexer'],
  },
  locales: ['en', 'bn'],
  output: 'src/locales/$LOCALE.json', // Where the files will be saved
  input: ['src/**/*.{js,jsx}'], // Where it looks for text
  keySeparator: false,
  namespaceSeparator: false,
};