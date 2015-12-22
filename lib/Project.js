'use strict';

var util = require('util');
var pcProject = require('poeditor-client/src/Project');

function Project(apiToken, data) {
	pcProject.call(this, apiToken, data);
}

util.inherits(Project, pcProject);

module.exports = Project;
