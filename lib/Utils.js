'use strict';

var Client = require('poeditor-client');
var Promise = require('bluebird');
var Immutable = require('immutable');

function Utils(apiToken) {
	this.apiToken = apiToken;
	this.client = new Client(apiToken);
}

Utils.prototype.getProject = function (projectName) {
	return Promise.resolve(this.client.projects.list())
	.then(function (projects) {
		return Immutable.List(projects)
		.find(function (project) {
			return project.name == projectName;
		});
	});
};

Utils.prototype.getTranslations = function (project) {
	return Promise.resolve(project.languages.list())
	.map(function (language) {
		return Promise.resolve(language.terms.list());
	})
	.then(function (terms) {
		return Immutable.fromJS(terms).flatten(1).toJS();
	});
};

module.exports = Utils;
