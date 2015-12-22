'use strict';

var PcProjects = require('poeditor-client/src/Projects');

var Project = require('./Project');

function getProject(apiToken, name) {
	return new PcProjects(apiToken).list()
	.filter(function (pcProject) {
		return pcProject.name == name;
	})
	.any(function (pcProject) {
		return new Project(apiToken, pcProject);
	});
}

module.exports = getProject;
