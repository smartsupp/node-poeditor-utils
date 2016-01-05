'use strict';

var Client = require('poeditor-client');
var Promise = require('bluebird');
var Immutable = require('immutable');
var fs = Promise.promisifyAll(require('fs'));
var stringify = require('json-stable-stringify');

var Translation = require('./Translation');

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
		return Promise.resolve(language.terms.list())
		.map(function (term) {
			return new Translation(term.term, language.code, term.translation);
		});
	})
	.then(function (items) {
		return Immutable.fromJS(items).flatten(1).toJS();
	});
};

exports.writeTranslations = function (translations, getFile) {
	var writes = Immutable.List(translations)
	.groupBy(getFile)
	.map(function (translations) {
		return Immutable.List(translations)
		.reduce(function (result, translation) {
			return result.set(translation.term, translation.value);
		}, Immutable.Map());
	})
	.map(function (translations, file) {
		var data = stringify(translations, {
			space: '\t'
		});
		return fs.writeFileAsync(file, data)
		.then(function () {
			return file;
		});
	})
	.toList()
	.toJS();
	return Promise.all(writes);
};
