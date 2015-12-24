'use strict';

var Client = require('poeditor-client');
var Promise = require('bluebird');
var Immutable = require('immutable');

var Project = require('./Project');

function Utils(apiToken) {
	this.apiToken = apiToken;
	this.client = new Client(apiToken);
}

Utils.prototype.getProject = function (projectName) {
	return Promise.resolve(this.client.projects.list())
	.then(function (pcProjects) {
		var pcProject = Immutable.List(pcProjects)
		.filter(function (pcProject) {
			return pcProject.name == projectName;
		})
		.first();
		return new Project(this.apiToken, pcProject);
	}.bind(this));
};

module.exports = Utils;
