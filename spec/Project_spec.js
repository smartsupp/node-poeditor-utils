'use strict';

var Project = require('../lib/Project');

describe('Project', function () {
	beforeEach(function () {
		this.project = new Project('sometoken', {
			name: 'somename',
			id: 2
		});
	});

	it('extends poeditor-client project', function () {
		expect(this.project.name).toBe('somename');
		expect(this.project.id).toBe(2);
		expect(this.project.languages).toBeTruthy();
		expect(this.project.terms).toBeTruthy();
	});

	it('provides project utilities', function () {
		expect(typeof this.project.utils).toBeTruthy();
	});
});
