'use strict';

var helpers = require('./helpers');

function Utils(apiToken) {
	this.apiToken = apiToken;
}

Utils.prototype.getProject = function (projectName) {
	return helpers.getProject(this.apiToken, projectName);
};

module.exports = Utils;
