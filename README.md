# poeditor-utils

higher-level POEditor utilities for Node.js

* uses [POEditor API v1][1] via [poeditor-client][2]
* API is still a subject to change

[1]: https://poeditor.com/api_reference/
[2]: https://github.com/janjakubnanista/poeditor-client

```js
var utils = require('poeditor-utils');
```

## utils.Client [DEPRECATED]

Exposes the [poeditor-client][2]  `Client` for practicality. See the docs there for more.

### new utils.Client(apiToken)

* `apiToken` `String` POEditor API token

```js
var client = new utils.Client('my token');
```

## utils.getProject(apiToken, projectName) [DEPRECATED]

* `apiToken` `String` POEditor API token
* `projectName` `String` POEditor project name

Returns a promise which resolves with a [poeditor-client][2] `Project` representation of the project. See the docs there for more.

```js
utils.getProject('my token', 'my project')
.then(function (project) {
	console.log(project); // Project {...}
});
```

## utils.pullTranslations(apiToken, projectName, getPathCallback)

* `apiToken` `String` POEditor API token
* `projectName` `String` POEditor project name
* `getPathCallback(translation)` `Function` produces destination file path for given translation
	* `translation` `Object` translation of a single term to a single language
		* `translation.projectName` `String`
		* `translation.languageCode` `String`
		* `translation.term` `String`
		* `translation.value` `String`

Gets translations for all the project languages and writes them to files as produced by `getPathCallback` as a stable sorted JSON. Returns a promise which resolves with an `Iterable` of output files.

```js
utils.pullTranslations('my token', 'my project', function (translation) {
	console.log(translation); // Translation {...}
	return 'my-translations/' + translation.languageCode + '.json';
})
.then(function (files) {
	console.log(files); // ['my-translations/en.json', ...]
});
```
