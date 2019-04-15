# poeditor-utils

higher-level POEditor utilities for Node.js

* uses [POEditor API v1][1] via [poeditor-client][2]
* API is still a subject to change

[1]: https://poeditor.com/api_reference/
[2]: https://github.com/janjakubnanista/poeditor-client

```js
import * as utils from 'poeditor-utils'
```

## ~~utils.Client(apiToken)~~ [DEPRECATED]

* `apiToken: string` - POEditor API token

Exposes the [poeditor-client][2] `Client` for practicality. See their docs for more.

## ~~utils.getProject(apiToken, projectName)~~ [DEPRECATED]

* `apiToken: string` - POEditor API token
* `projectName: string` - POEditor project name

Returns a promise which resolves with a [poeditor-client][2] `Project` representation of the project. See their docs for more.

## utils.pullTranslations(apiToken, projectName, getPathCallback)

* `apiToken: string` - POEditor API token
* `projectName: string` - POEditor project name
* `getPathCallback: (translation) => string` - produces destination file path for given translation
  * `translation: Object` - translation of a single term to a single language with the following properties:
    * `projectName: string`
    * `languageCode: string`
    * `term: string`
    * `value: string`

Gets translations for all the project languages and writes them to files by `getPathCallback` as a stable sorted JSON. Returns a promise which resolves with an array of file paths written.

```js
utils.pullTranslations('API token', 'project name', (translation) => {
	console.log(translation) // Translation {...}
	return 'translations/' + translation.languageCode + '.json'
})
.then((paths) => {
	console.log(paths) // ['translations/en.json', ...]
})
```
