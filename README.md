# poeditor-utils

high-level [POEditor API][1] utilities for Node.js

* based around [poeditor-client][2]
* API is a subject to change

```js
var utils = require('poeditor-utils');
```

## utils.getProject(apiToken, projectName)

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
		* `translation.term` `String`
		* `translation.language` `String`
		* `translation.value` `String`

Gets translations for all the project languages and writes them to files as produced by `getPathCallback` as a stable sorted JSON. Returns a promise which resolves with an `Iterable` of output files.

```js
utils.pullTranslations('my token', 'my project', function (translation) {
	console.log(translation); // Translation {...}
	return 'my-translations/' + translation.language + '.json';
})
.then(function (files) {
	console.log(files); // ['my-translations/en.json', ...]
});
```

## utils.Client

Exposes the [poeditor-client][2]  `Client` for practicality. See the docs there for more.

### new utils.Client(apiToken)

* `apiToken`: POEditor API token

```js
var client = new utils.Client('my token');
```

[1]: https://poeditor.com/api_reference/
[2]: https://github.com/janjakubnanista/poeditor-client
