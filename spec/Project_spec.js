'use strict';

var Project = require('../lib/Project');

describe('Project', function () {
	beforeEach(function () {
		this.project = new Project('sometoken', 'somename', 2, {
			something: 3,
		});
	});

	it('creates a proxy object for working with a project', function () {
		expect(this.project.apiToken).toBe('sometoken');
		expect(this.project.name).toBe('somename');
		expect(this.project.id).toBe(2);
		expect(this.project.data.something).toBe(3);
	});
});
