import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesResourceDir = path.join(__dirname, '..', 'locales');
const localesDir = path.join(__dirname, '..', '..', 'public', 'locales');
const languages = ['fi', 'ru'];
const translations = {};

// Считывание текущих файлов переводов
languages.forEach((lang) => {
	const filePath = path.join(localesDir, `${lang}.json`);
	if (fs.existsSync(filePath)) {
		translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	} else {
		translations[lang] = {};
	}
});

const sortObjectKeys = (obj) => {
	const sortedObj = {};
	const keys = Object.keys(obj).sort();
	keys.forEach((key) => {
		if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
			sortedObj[key] = sortObjectKeys(obj[key]);
		} else {
			sortedObj[key] = obj[key];
		}
	});
	return sortedObj;
};

const mergeTranslations = (oldTranslations, newTranslations, pathParts) => {
	const currentPath = pathParts.shift();
	if (pathParts.length === 0) {
		newTranslations[currentPath] = oldTranslations;
	} else {
		if (!newTranslations[currentPath]) {
			newTranslations[currentPath] = {};
		}
		mergeTranslations(oldTranslations, newTranslations[currentPath], pathParts);
	}
};

const getAllFiles = (dirPath, arrayOfFiles) => {
	const files = fs.readdirSync(dirPath);

	arrayOfFiles = arrayOfFiles || [];

	files.forEach((file) => {
		if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
			arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
		} else {
			arrayOfFiles.push(path.join(dirPath, file));
		}
	});

	return arrayOfFiles;
};

const getDirectories = (source) => {
	return fs.readdirSync(source).filter((name) => fs.statSync(path.join(source, name)).isDirectory());
};

const migrateTranslations = () => {
	const directories = getDirectories(localesResourceDir);
	const oldFiles = directories.flatMap((dir) => getAllFiles(path.join(localesResourceDir, dir))).filter((file) => file.endsWith('.json'));

	oldFiles.forEach((file) => {
		const oldTranslations = JSON.parse(fs.readFileSync(file, 'utf-8'));
		const relativePath = path.relative(localesResourceDir, file);
		const pathParts = relativePath.split(path.sep);
		const fileName = pathParts.pop().replace('.json', '');
		pathParts.push(fileName);

		languages.forEach((lang) => {
			if (oldTranslations[lang]) {
				const newPaths = [...pathParts];
				console.log(`Обработка файла: ${file} для языка: ${lang}`, newPaths);
				mergeTranslations(oldTranslations[lang], translations[lang], newPaths);
			}
		});
	});

	languages.forEach((lang) => {
		const sortedTranslations = sortObjectKeys(translations[lang]);
		const newFilePath = path.join(localesDir, `${lang}.json`);
		fs.writeFileSync(newFilePath, JSON.stringify(sortedTranslations, null, 2), 'utf-8');
		console.log(`Переводы для языка ${lang} сохранены в ${newFilePath}`);
	});

	console.log('Перенос переводов завершен.');
};

migrateTranslations();
