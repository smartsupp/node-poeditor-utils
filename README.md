# poeditor-utils

higher-level POEditor utilities for Node.js

* uses [POEditor API v1][1] via [poeditor-client][2]
* API is still a subject to change

[1]: https://poeditor.com/api_reference/
[2]: https://github.com/janjakubnanista/poeditor-client

## Usage

```js
import * as utils from 'poeditor-utils'
import * as fs from 'fs'

const languageCodeOverrides = {
	'pt-br': 'pt',
}
const translations = await utils.getTranslations('API token', [
	'project A',
	'project B',
])
const translationsByLanguage = utils.groupTranslations(translations, (translation) => translation.languageCode)
translationsByLanguage.forEach((translations, languageCode) => {
	const language = languageCodeOverrides[languageCode] || languageCode
	const data = utils.formatTranslationsAsJson(translations, {
		indent: 2,
	})
	fs.writeFileSync(`./translations/${language}.json`, data)
})
```

## utils.Translation

* `projectName: string`
* `languageCode: string`
* `term: string`
* `value: string`

Translation of a single term to a single language.

## utils.getTranslations(apiToken, projectNames)

* `apiToken: string`
* `projectNames: string[]`
* returns `Promise<Translation[]>`

Gets translations for multiple projects for all the project languages.

## utils.groupTranslations(translations, grouper)

* `translations: Translation[]`
* `grouper: (translation: Translation) => string`
* returns `Map<string, Translation[]>`

Groups translations by keys produced by `grouper`.

## utils.formatTranslationsAsJson(translations[, options])

* `translations: Translation[]`
* `options: Object`
  * `indent: number | string`
* returns `string`

Formats translations to string as stable sorted JSON.

## Obsolete API

### ~~utils.Client(apiToken)~~ [DEPRECATED]

* `apiToken: string` - POEditor API token

Exposes the [poeditor-client][2] `Client`. See their docs for more.

### ~~utils.getProject(apiToken, projectName)~~ [DEPRECATED]

* `apiToken: string` - POEditor API token
* `projectName: string` - POEditor project name

Returns a promise which resolves with a [poeditor-client][2] `Project` representation of the project. See their docs for more.

### ~~utils.pullTranslations(apiToken, projectName, getPathCallback)~~ [DEPRECATED]

* `apiToken: string` - POEditor API token
* `projectName: string` - POEditor project name
* `getPathCallback: (translation: Translation) => string` - produces destination file path for given translation

Gets translations for all the project languages and writes them to files by `getPathCallback` as a stable sorted JSON. Returns a promise which resolves with an array of file paths written.

```js
utils.pullTranslations('API token', 'project name', (translation) => {
	return 'translations/' + translation.languageCode + '.json'
})
.then((paths) => {
	console.log(paths) // ['translations/en.json', ...]
})
```
