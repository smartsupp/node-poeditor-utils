'use strict';

var PcProjects = require('poeditor-client/src/Projects');
var Promise = require('bluebird');
var Immutable = require('immutable');

var Project = require('./Project');

function getProject(apiToken, name) {
	return Promise.resolve(new PcProjects(apiToken).list())
	.then(function (pcProjects) {
		var pcProject = Immutable.List(pcProjects)
		.filter(function (pcProject) {
			return pcProject.name == name;
		})
		.first();
		return new Project(apiToken, pcProject);
	});
}

module.exports = getProject;
