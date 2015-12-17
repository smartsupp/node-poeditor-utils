'use strict';

var Promise = require('bluebird');

var Projects = require('poeditor-client/src/Projects');

var getProject = require('../lib/getProject');

describe('getProject', function () {
	beforeEach(function () {
		spyOn(Projects.prototype, 'list').and.returnValue(new Promise.resolve([
			{id: 1, name: '1'},
			{id: 2, name: 'somename'},
			{id: 3, name: '3'}
		]));
	});

	it('returns a promise', function () {
		expect(typeof getProject('sometoken', 'somename').then).toBe('function');
	});

	it('gets project data via POEditor API', function (done) {
		getProject('sometoken', 'somename')
		.then(function (project) {
			done();
			expect(typeof project).toBe('object');
			expect(project).not.toBeNull();
			expect(project.apiToken).toBe('sometoken');
			expect(project.id).toBe(2);
			expect(project.data.name).toBe('somename');
		});
	});
});
