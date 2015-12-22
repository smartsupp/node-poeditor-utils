'use strict';

var ProjectUtils = require('../lib/ProjectUtils');

describe('ProjectUtils', function () {
	beforeEach(function () {
		this.project = {};
		this.utils = new ProjectUtils(this.project);
	});

	it('keeps given project reference', function () {
		expect(this.utils.project).toBe(this.project);
	});
});
