'use strict';

var Client = require('poeditor-client');
var Promise = require('bluebird');
var Immutable = require('immutable');

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
