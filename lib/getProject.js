'use strict';

var Projects = require('poeditor-client/src/Projects');
var Immutable = require('immutable');

var Project = require('./Project');

var getProject = function (apiToken, name) {
	return new Projects(apiToken).list()
	.then(function (projects) {
		return Immutable.List(projects).find(function (project) {
			return project.name == name;
		});
	})
	.then(function (project) {
		return new Project(apiToken, name, project.id, project);
	});
};

module.exports = getProject;
