module.exports = {
	locales: ['fi', 'ru'],
	input: ['../**/*.{js,jsx,ts,tsx}'],
	output: 'public/locales/$LOCALE.json',
	defaultValue: (lng, ns, key) => {
		const parts = key.split('.');
		return parts.slice(-2).join('.');
	},
	defaultNamespace: 'translation',
	namespaceSeparator: false,
	contextSeparator: '_',
	namespaceSeparator: ':',
	keySeparator: '.',
	createOldCatalogs: true,
	verbose: true,
	keepRemoved: false,
	sort: true,
	lexers: {
		js: ['JavascriptLexer'],
		jsx: ['JsxLexer'],
		ts: ['JavascriptLexer'],
		tsx: ['JsxLexer'],
		default: ['JsxLexer']
	}
};
