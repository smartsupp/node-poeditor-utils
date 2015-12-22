'use strict';

var util = require('util');
var PcProject = require('poeditor-client/src/Project');

var ProjectUtils = require('./ProjectUtils');

function Project(apiToken, pcProject) {
	PcProject.call(this, apiToken, pcProject);
	this.utils = new ProjectUtils(this);
}

util.inherits(Project, PcProject);

module.exports = Project;
