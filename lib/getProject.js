'use strict';

var pcProjects = require('poeditor-client/src/Projects');
var Immutable = require('immutable');

var Project = require('./Project');

function getProject(apiToken, name) {
	return new pcProjects(apiToken).list()
	.then(function (projects) {
		return Immutable.List(projects).find(function (project) {
			return project.name == name;
		});
	})
	.then(function (project) {
		return new Project(apiToken, project);
	});
}

module.exports = getProject;
