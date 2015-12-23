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
		expect(this.project).toEqual(jasmine.objectContaining({
			name: 'somename',
			id: 2,
			languages: jasmine.any(Object),
			terms: jasmine.any(Object)
		}));
	});

	it('provides project utilities', function () {
		expect(this.project.utils).toEqual(jasmine.any(Object));
	});
});
