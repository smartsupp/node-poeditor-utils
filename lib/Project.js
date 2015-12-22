'use strict';

var util = require('util');
var pcProject = require('poeditor-client/src/Project');

var ProjectUtils = require('./ProjectUtils');

function Project(apiToken, data) {
	pcProject.call(this, apiToken, data);
	this.utils = new ProjectUtils(this);
}

util.inherits(Project, pcProject);

module.exports = Project;
