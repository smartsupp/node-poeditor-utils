'use strict';

var Project = require('../lib/Project');

describe('Project', function () {
	it('extends poeditor-client project', function () {
		var project = new Project('sometoken', {
			name: 'somename',
			id: 2
		});
		expect(project.name).toBe('somename');
		expect(project.id).toBe(2);
		expect(project.languages).toBeTruthy();
		expect(project.terms).toBeTruthy();
	});
});
