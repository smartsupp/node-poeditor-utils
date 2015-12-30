'use strict';

var Client = require('poeditor-client');
var Promise = require('bluebird');
var Immutable = require('immutable');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

exports.clientFactory = function (apiToken) {
	return new Client(apiToken);
};

exports.getProject = function (apiToken, projectName) {
	return Promise.resolve(exports.clientFactory(apiToken).projects.list())
	.then(function (projects) {
		return Immutable.List(projects)
		.find(function (project) {
			return project.name == projectName;
		});
	});
};

exports.getTranslations = function (project) {
	return Promise.resolve(project.languages.list())
	.map(function (language) {
		return Promise.resolve(language.terms.list());
	})
	.then(function (terms) {
		return Immutable.fromJS(terms).flatten(1).toJS();
	});
};

exports.writeTranslations = function (translations, dest) {
	var writes = Immutable.List(translations)
	.groupBy(function (translation) {
		return translation.__languageCode;
	})
	.map(function (translations) {
		return Immutable.List(translations)
		.reduce(function (result, translation) {
			return result.set(translation.term, translation.translation);
		}, Immutable.Map());
	})
	.map(function (translations, languageCode) {
		var file = path.join(dest, languageCode + '.json');
		var data = JSON.stringify(translations, null, '\t');
		return fs.writeFileAsync(file, data);
	})
	.toList()
	.toJS();
	return Promise.all(writes);
};
