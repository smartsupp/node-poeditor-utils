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
		.filter(function (project) {
			return project.name == projectName;
		})
		.first();
	});
};

Utils.prototype.getTranslations = function (project) {
	// get languages
	return Promise.resolve(project.languages.list())
	// get terms
	.map(function (language) {
		return Promise.resolve(language.terms.list());
	})
	// flatten
	.then(function (terms) {
		return Immutable.List(terms)
		.map(function (terms) {
			return Immutable.List(terms);
		})
		.flatten()
		.toArray();
	});
};

module.exports = Utils;
