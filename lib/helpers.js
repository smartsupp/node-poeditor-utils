'use strict';

var Client = require('poeditor-client');
var Promise = require('bluebird');
var Immutable = require('immutable');

var clientFactory = function (apiToken) {
	return new Client(apiToken);
};

var getProject = function (apiToken, projectName) {
	return Promise.resolve(clientFactory(apiToken).projects.list())
	.then(function (projects) {
		return Immutable.List(projects)
		.find(function (project) {
			return project.name == projectName;
		});
	});
};

var getTranslations = function (project) {
	return Promise.resolve(project.languages.list())
	.map(function (language) {
		return Promise.resolve(language.terms.list());
	})
	.then(function (terms) {
		return Immutable.fromJS(terms).flatten(1).toJS();
	});
};

module.exports = {
	clientFactory: clientFactory,
	getProject: getProject,
	getTranslations: getTranslations
};
