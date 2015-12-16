'use strict';

var Project = function (apiToken, name, id, data) {
	this.apiToken = apiToken;
	this.name = name;
	this.id = id;
	this.data = data;
};

module.exports = Project;
