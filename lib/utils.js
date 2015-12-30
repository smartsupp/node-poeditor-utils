'use strict';

var helpers = require('./helpers');

var getProject = function (apiToken, projectName) {
	return helpers.getProject(apiToken, projectName);
};

module.exports = {
	getProject: getProject
};
