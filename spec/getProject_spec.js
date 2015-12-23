'use strict';

var Promise = require('bluebird');
var Projects = require('poeditor-client/src/Projects');

var getProject = require('../lib/getProject');

describe('getProject', function () {
	beforeEach(function () {
		spyOn(Projects.prototype, 'list').and.returnValue(new Promise.resolve([
			{id: 123, name: 'one'},
			{id: 456, name: 'somename'},
			{id: 789, name: 'three'}
		]));
	});

	it('returns a promise', function () {
		expect(getProject('sometoken', 'somename').then).toEqual(jasmine.any(Function));
	});

	it('gets project data via POEditor API', function (done) {
		getProject('sometoken', 'somename')
		.then(function (project) {
			expect(project).toEqual(jasmine.objectContaining({
				id: 456,
				name: 'somename'
			}));
			done();
		});
	});
});
